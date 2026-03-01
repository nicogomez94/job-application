const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const prisma = require('./database');

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
        // Buscar usuario existente
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          // Crear nuevo usuario
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails[0].value,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              profileImage: profile.photos?.[0]?.value,
            },
          });
        }

        return done(null, user);
      } catch (error) {
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
        let company = await prisma.company.findUnique({
          where: { googleId: profile.id },
        });

        if (!company) {
          company = await prisma.company.create({
            data: {
              googleId: profile.id,
              email: profile.emails[0].value,
              companyName: profile.displayName,
              companyLogo: profile.photos?.[0]?.value,
            },
          });
        }

        return done(null, company);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
