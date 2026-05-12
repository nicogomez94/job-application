const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { generateToken } = require('../config/jwt');

const normalizeEmail = (email) => (email || '').trim().toLowerCase();

// ─── REGISTER ───────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, registrationType } = req.body;

    const existing = await prisma.psychologist.findUnique({
      where: { email: normalizeEmail(email) },
    });
    if (existing) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const psychologist = await prisma.psychologist.create({
      data: {
        email: normalizeEmail(email),
        password: hashedPassword,
        firstName,
        lastName,
        registrationType, // 'ARGENTINA' | 'INTERNATIONAL'
        status: 'PENDING_DOCS',
      },
      select: {
        id: true,
        email: true,
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
    console.error('Error en register psychologist:', error.message || error);
    res.status(500).json({
      error: 'Error al registrar psicólogo',
      ...(process.env.NODE_ENV !== 'production' && { detail: error.message }),
    });
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
