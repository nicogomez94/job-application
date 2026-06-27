const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const {
  generateToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
} = require('../config/jwt');
const { getDefaultFrontendUrl } = require('../config/frontend');
const { sendPasswordRecoveryEmail } = require('../services/mail.service');
const {
  normalizeEmail,
  findAccountByEmail,
  getEmailAlreadyRegisteredMessage,
  handlePrismaError,
} = require('../utils/accountEmail');
const { validateAndNormalizePhoneNumber } = require('../utils/phone');
const { isValidEmail } = require('../utils/emailValidation');
const {
  sendVerificationForAccount,
  requestVerificationEmail,
  confirmEmailVerification,
} = require('../services/emailVerification.service');

const sendInitialVerification = async (account, type) => {
  try {
    await sendVerificationForAccount({ id: account.id, type, email: account.email });
    return true;
  } catch (error) {
    console.error(`[email-verification] No se pudo enviar el correo inicial a ${type}:`, error.message);
    return false;
  }
};

// ==================== USUARIOS ====================

// Registro de usuario
exports.registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: email, contraseña, nombre y apellido son requeridos.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'El formato del email es inválido.' });
    }

    const normalizedPhone = validateAndNormalizePhoneNumber(phone);
    if (!normalizedPhone.isValid) {
      return res.status(400).json({ error: normalizedPhone.error });
    }

    const normalizedEmail = normalizeEmail(email);

    // Verificar si el email ya existe en cualquiera de las cuentas del sitio
    const existingAccount = await findAccountByEmail(prisma, normalizedEmail);
    if (existingAccount) {
      return res.status(400).json({ error: getEmailAlreadyRegisteredMessage(existingAccount) });
    }

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        firstName,
        lastName,
        phone: normalizedPhone.value,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Generar token
    const token = generateToken({ id: user.id, type: 'user' });
    const verificationEmailSent = await sendInitialVerification(user, 'user');

    res.status(201).json({
      message: 'Usuario registrado. Confirmá tu email para continuar.',
      user,
      token,
      verificationEmailSent,
    });
  } catch (error) {
    console.error('Error en registerUser:', error);
    const userMessage = error?.code?.startsWith('P')
      ? handlePrismaError(error, 'registro')
      : 'Error al registrar usuario. Intentá nuevamente en unos minutos.';
    res.status(500).json({ error: userMessage });
  }
};

// Login de usuario
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Buscar usuario
    const user = await prisma.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
    });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Requerir CV para permitir el inicio de sesión de candidatos
    if (!user.cvUrl) {
      return res.status(403).json({
        error: 'Debés subir tu CV para iniciar sesión',
      });
    }

    // Generar token
    const token = generateToken({ id: user.id, type: 'user' });

    // Remover password de la respuesta
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login exitoso',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Error en loginUser:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// ==================== EMPRESAS ====================

// Registro de empresa
exports.registerCompany = async (req, res) => {
  try {
    const { email, password, companyName, description, website, location, industry, size } = req.body;
    const normalizedEmail = normalizeEmail(email);

    // Verificar si el email ya existe en cualquiera de las cuentas del sitio
    const existingAccount = await findAccountByEmail(prisma, normalizedEmail);
    if (existingAccount) {
      return res.status(400).json({ error: getEmailAlreadyRegisteredMessage(existingAccount) });
    }

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await prisma.company.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        companyName,
        description,
        website,
        location,
        industry,
        size,
      },
      select: {
        id: true,
        email: true,
        companyName: true,
        description: true,
        website: true,
        location: true,
        industry: true,
        size: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Generar token
    const token = generateToken({ id: company.id, type: 'company' });
    const verificationEmailSent = await sendInitialVerification(company, 'company');

    res.status(201).json({
      message: 'Empresa registrada. Confirmá tu email para continuar.',
      company,
      token,
      verificationEmailSent,
    });
  } catch (error) {
    console.error('Error en registerCompany:', error);
    res.status(500).json({ error: 'Error al registrar empresa' });
  }
};

// Login de empresa
exports.loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Buscar empresa
    const company = await prisma.company.findFirst({
      where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
    });
    if (!company || !company.password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, company.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = generateToken({ id: company.id, type: 'company' });

    // Remover password de la respuesta
    const { password: _, ...companyWithoutPassword } = company;

    res.json({
      message: 'Login exitoso',
      company: companyWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Error en loginCompany:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// ==================== ADMINISTRADORES ====================

// Login de admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Buscar admin
    const admin = await prisma.admin.findFirst({
      where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
    });
    if (!admin) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = generateToken({ id: admin.id, type: 'admin' });

    // Remover password de la respuesta
    const { password: _, ...adminWithoutPassword } = admin;

    res.json({
      message: 'Login exitoso',
      admin: adminWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Error en loginAdmin:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Solicitud de recuperación de clave
exports.requestPasswordRecovery = async (req, res) => {
  try {
    const { email, userType } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const searchStrategies = {
      user: () =>
        prisma.user.findFirst({
          where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
          select: { id: true, email: true, password: true },
        }),
      company: () =>
        prisma.company.findFirst({
          where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
          select: { id: true, email: true, password: true },
        }),
      patient: () =>
        prisma.patient.findFirst({
          where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
          select: { id: true, email: true, password: true },
        }),
      psychologist: () =>
        prisma.psychologist.findFirst({
          where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
          select: { id: true, email: true, password: true },
        }),
      admin: () =>
        prisma.admin.findFirst({
          where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
          select: { id: true, email: true, password: true },
        }),
    };

    const selectedTypes = userType ? [userType] : ['user', 'company', 'patient', 'psychologist', 'admin'];
    let foundAccount = null;

    for (const type of selectedTypes) {
      const strategy = searchStrategies[type];
      if (!strategy) continue;
      const account = await strategy();
      if (account) {
        foundAccount = { ...account, type };
        break;
      }
    }

    if (foundAccount && foundAccount.password) {
      const token = generatePasswordResetToken({
        id: foundAccount.id,
        type: foundAccount.type,
      });
      const frontendBaseUrl = getDefaultFrontendUrl();
      const resetUrl = `${frontendBaseUrl}/reset-password?token=${encodeURIComponent(token)}`;

      await sendPasswordRecoveryEmail({
        to: foundAccount.email,
        resetUrl,
      });
    }

    res.json({
      message: 'Si el email está registrado, recibirás instrucciones para recuperar tu clave.',
    });
  } catch (error) {
    console.error('Error en requestPasswordRecovery:', error);
    res.status(500).json({ error: 'No se pudo procesar la recuperación de clave' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = verifyPasswordResetToken(token);
    if (!decoded?.id || !decoded?.type) {
      return res.status(400).json({ error: 'El enlace de recuperación es inválido o expiró' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (decoded.type === 'user') {
      await prisma.user.update({
        where: { id: decoded.id },
        data: { password: hashedPassword },
      });
    } else if (decoded.type === 'company') {
      await prisma.company.update({
        where: { id: decoded.id },
        data: { password: hashedPassword },
      });
    } else if (decoded.type === 'patient') {
      await prisma.patient.update({
        where: { id: decoded.id },
        data: { password: hashedPassword },
      });
    } else if (decoded.type === 'psychologist') {
      await prisma.psychologist.update({
        where: { id: decoded.id },
        data: { password: hashedPassword },
      });
    } else if (decoded.type === 'admin') {
      await prisma.admin.update({
        where: { id: decoded.id },
        data: { password: hashedPassword },
      });
    } else {
      return res.status(400).json({ error: 'Tipo de usuario inválido' });
    }

    res.json({ message: 'Clave restablecida correctamente' });
  } catch (error) {
    if (error?.code === 'P2025') {
      return res.status(400).json({ error: 'El enlace de recuperación es inválido o expiró' });
    }

    console.error('Error en resetPassword:', error);
    res.status(500).json({ error: 'No se pudo restablecer la clave' });
  }
};

exports.requestEmailVerification = async (req, res) => {
  try {
    const { email, userType } = req.body;
    await requestVerificationEmail({ email, type: userType });

    res.json({
      message: 'Si la cuenta existe y todavía no está verificada, recibirás un nuevo enlace.',
    });
  } catch (error) {
    console.error('Error al reenviar confirmación de email:', error);
    res.status(500).json({ error: 'No se pudo enviar el email de confirmación' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const result = await confirmEmailVerification(req.query.token);
    if (!result) {
      return res.status(400).json({ error: 'El enlace de confirmación es inválido o expiró' });
    }

    res.json({
      message: 'Email confirmado correctamente',
      account: result,
      type: result.type,
    });
  } catch (error) {
    console.error('Error al confirmar email:', error);
    res.status(500).json({ error: 'No se pudo confirmar el email' });
  }
};

// ==================== PERFIL ====================

// Obtener perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    const { id, type } = req.user;
    let profile;

    if (type === 'user') {
      profile = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          emailVerified: true,
          emailVerifiedAt: true,
          firstName: true,
          lastName: true,
          phone: true,
          profileImage: true,
          title: true,
          bio: true,
          experience: true,
          education: true,
          skills: true,
          languages: true,
          cvUrl: true,
          uploadedFiles: true,
          location: true,
          linkedinUrl: true,
          portfolioUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } else if (type === 'company') {
      profile = await prisma.company.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          emailVerified: true,
          emailVerifiedAt: true,
          companyName: true,
          companyLogo: true,
          description: true,
          website: true,
          location: true,
          industry: true,
          size: true,
          isActive: true,
          isBlocked: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } else if (type === 'patient') {
      profile = await prisma.patient.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          emailVerified: true,
          emailVerifiedAt: true,
          firstName: true,
          lastName: true,
          gender: true,
          phone: true,
          profileImage: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } else if (type === 'psychologist') {
      profile = await prisma.psychologist.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          emailVerified: true,
          emailVerifiedAt: true,
          firstName: true,
          lastName: true,
          phone: true,
          contactEmail: true,
          profileImage: true,
          registrationType: true,
          status: true,
          displayName: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } else if (type === 'admin') {
      profile = await prisma.admin.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    if (!profile) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    res.json({ profile, type });
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};
