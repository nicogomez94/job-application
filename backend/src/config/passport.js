const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const prisma = require('./database');
const addMonths = (date, months) => {
  const value = new Date(date);
  value.setMonth(value.getMonth() + months);
  return value;
};
const normalizeEmail = (email) => (email || '').trim().toLowerCase();
const getGoogleEmail = (profile) => normalizeEmail(profile?.emails?.[0]?.value);
const getUniqueConstraintFields = (error) =>
  Array.isArray(error?.meta?.target)
    ? error.meta.target.map((field) => String(field).toLowerCase())
    : [];
const isPrismaUniqueError = (error) => error?.code === 'P2002';

const getOAuthPrismaErrorMessage = (error) => {
  if (!isPrismaUniqueError(error)) return null;

  const fields = getUniqueConstraintFields(error);
  if (fields.includes('email')) {
    return 'Ese email ya esta registrado. Inicia sesion o recupera tu clave.';
  }

  if (fields.includes('googleid')) {
    return 'Esta cuenta de Google ya esta vinculada a otro usuario.';
  }

  return 'No se pudo completar el login con Google';
};

const getNameFromProfile = (profile) => {
  const rawGivenName = profile?.name?.givenName?.trim();
  const rawFamilyName = profile?.name?.familyName?.trim();

  if (rawGivenName && rawFamilyName) {
    return { firstName: rawGivenName, lastName: rawFamilyName };
  }

  const displayName = profile?.displayName?.trim() || '';
  if (!displayName) {
    return { firstName: 'Usuario', lastName: 'Google' };
  }

  const [firstName, ...lastNameParts] = displayName.split(/\s+/);
  return {
    firstName: firstName || 'Usuario',
    lastName: lastNameParts.join(' ') || 'Google',
  };
};

// JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      let user = null;
      
      // Verificar tipo de usuario
      if (payload.type === 'user') {
        user = await prisma.user.findUnique({ where: { id: payload.id } });
      } else if (payload.type === 'company') {
        user = await prisma.company.findUnique({ where: { id: payload.id } });
      } else if (payload.type === 'admin') {
        user = await prisma.admin.findUnique({ where: { id: payload.id } });
      } else if (payload.type === 'psychologist') {
        user = await prisma.psychologist.findUnique({ where: { id: payload.id } });
      }

      if (user) {
        return done(null, { ...user, type: payload.type });
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Google OAuth Strategy para Usuarios
passport.use(
  'google-user',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/user/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleEmail = getGoogleEmail(profile);
        const googlePhoto = profile?.photos?.[0]?.value || null;

        if (!googleEmail) {
          return done(new Error('Google no devolvio un email para esta cuenta'), null);
        }

        // Buscar usuario existente
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          const existingUserByEmail = await prisma.user.findFirst({
            where: { email: { equals: googleEmail, mode: 'insensitive' } },
          });

          if (existingUserByEmail) {
            if (existingUserByEmail.googleId && existingUserByEmail.googleId !== profile.id) {
              return done(null, false, { message: 'Esta cuenta ya esta vinculada a otro acceso de Google' });
            }

            const updateData = { googleId: profile.id };
            if (!existingUserByEmail.profileImage && googlePhoto) {
              updateData.profileImage = googlePhoto;
            }

            user = await prisma.user.update({
              where: { id: existingUserByEmail.id },
              data: updateData,
            });
          } else {
            const { firstName, lastName } = getNameFromProfile(profile);
            user = await prisma.user.create({
              data: {
                googleId: profile.id,
                email: googleEmail,
                firstName,
                lastName,
                profileImage: googlePhoto,
              },
            });
          }
        }

        return done(null, user);
      } catch (error) {
        const friendlyMessage = getOAuthPrismaErrorMessage(error);
        if (friendlyMessage) {
          return done(null, false, { message: friendlyMessage });
        }

        return done(error, null);
      }
    }
  )
);

// Google OAuth Strategy para Empresas
passport.use(
  'google-company',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/company/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleEmail = getGoogleEmail(profile);
        const googlePhoto = profile?.photos?.[0]?.value || null;

        if (!googleEmail) {
          return done(new Error('Google no devolvio un email para esta cuenta'), null);
        }

        let company = await prisma.company.findUnique({
          where: { googleId: profile.id },
        });

        if (!company) {
          const existingCompanyByEmail = await prisma.company.findFirst({
            where: { email: { equals: googleEmail, mode: 'insensitive' } },
          });

          if (existingCompanyByEmail) {
            if (existingCompanyByEmail.googleId && existingCompanyByEmail.googleId !== profile.id) {
              return done(null, false, { message: 'Esta empresa ya esta vinculada a otro acceso de Google' });
            }

            const updateData = { googleId: profile.id };
            if (!existingCompanyByEmail.companyLogo && googlePhoto) {
              updateData.companyLogo = googlePhoto;
            }

            company = await prisma.company.update({
              where: { id: existingCompanyByEmail.id },
              data: updateData,
            });
          } else {
            company = await prisma.$transaction(async (tx) => {
              const createdCompany = await tx.company.create({
                data: {
                  googleId: profile.id,
                  email: googleEmail,
                  companyName: profile.displayName || googleEmail.split('@')[0],
                  companyLogo: googlePhoto,
                },
              });

              const startDate = new Date();
              await tx.subscription.create({
                data: {
                  companyId: createdCompany.id,
                  plan: 'TRIAL',
                  status: 'ACTIVE',
                  startDate,
                  endDate: addMonths(startDate, 2),
                  amount: 0,
                  currency: 'USD',
                  paymentStatus: 'free',
                  paymentMethod: 'free',
                },
              });

              return createdCompany;
            });
          }
        }

        return done(null, company);
      } catch (error) {
        const friendlyMessage = getOAuthPrismaErrorMessage(error);
        if (friendlyMessage) {
          return done(null, false, { message: friendlyMessage });
        }

        return done(error, null);
      }
    }
  )
);

module.exports = passport;
