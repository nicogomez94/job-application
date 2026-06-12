const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { generateToken } = require('../config/jwt');
const {
  normalizeEmail,
  findAccountByEmail,
  getEmailAlreadyRegisteredMessage,
  handlePrismaError,
} = require('../utils/accountEmail');
const { buildConsentMetadata } = require('../utils/legalAcceptance');

// ─── REGISTER ───────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      registrationType,
      acceptTerms,
      acceptPrivacy,
      acceptAgreement,
    } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: email, contraseña, nombre y apellido son requeridos.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'El formato del email es inválido.' });
    }
    if (!acceptTerms || !acceptPrivacy || !acceptAgreement) {
      return res.status(400).json({ error: 'Debés aceptar los Términos y Condiciones, la Política de Privacidad y el Acuerdo de Aceptación.' });
    }

    const normalizedEmail = normalizeEmail(email);
    const existingAccount = await findAccountByEmail(prisma, normalizedEmail);
    if (existingAccount) {
      return res.status(400).json({ error: getEmailAlreadyRegisteredMessage(existingAccount) });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const psychologist = await prisma.psychologist.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        firstName,
        lastName,
        registrationType, // 'ARGENTINA' | 'INTERNATIONAL'
        status: 'PENDING_DOCS',
        acceptTerms: true,
        acceptPrivacy: true,
        acceptAgreement: true,
        consentMetadata: buildConsentMetadata({ role: 'psychologist', req }),
      },
      select: {
        id: true,
        email: true,
        acceptTerms: true,
        acceptPrivacy: true,
        acceptAgreement: true,
        consentMetadata: true,
        firstName: true,
        lastName: true,
        registrationType: true,
        status: true,
        createdAt: true,
      },
    });

    const token = generateToken({ id: psychologist.id, type: 'psychologist' });

    res.status(201).json({
      message: 'Registro iniciado. Por favor cargá tu documentación.',
      psychologist,
      token,
    });
  } catch (error) {
    console.error('Error en register psychologist:', error);
    const userMessage = error?.code?.startsWith('P')
      ? handlePrismaError(error, 'registro')
      : 'Error al registrar psicólogo. Intentá nuevamente en unos minutos.';
    res.status(500).json({ error: userMessage });
  }
};

// ─── LOGIN ───────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const psychologist = await prisma.psychologist.findFirst({
      where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
    });

    if (!psychologist) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordMatch = await bcrypt.compare(password, psychologist.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generateToken({ id: psychologist.id, type: 'psychologist' });

    const { password: _pass, ...safeData } = psychologist;

    res.json({
      message: 'Login exitoso',
      psychologist: safeData,
      token,
    });
  } catch (error) {
    console.error('Error en login psychologist:', error.message || error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
