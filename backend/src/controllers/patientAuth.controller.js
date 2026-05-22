const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { generateToken } = require('../config/jwt');
const {
  normalizeEmail,
  findAccountByEmail,
  getEmailAlreadyRegisteredMessage,
} = require('../utils/accountEmail');

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const existingAccount = await findAccountByEmail(prisma, normalizedEmail);
    if (existingAccount) {
      return res.status(400).json({ error: getEmailAlreadyRegisteredMessage(existingAccount) });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = await prisma.patient.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
      },
    });

    const token = generateToken({ id: patient.id, type: 'patient' });

    res.status(201).json({
      message: 'Paciente registrado exitosamente',
      patient,
      token,
    });
  } catch (error) {
    console.error('Error en register patient:', error.message || error);
    res.status(500).json({
      error: 'Error al registrar paciente',
      ...(process.env.NODE_ENV !== 'production' && { detail: error.message }),
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const patient = await prisma.patient.findFirst({
      where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
    });

    if (!patient) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordMatch = await bcrypt.compare(password, patient.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generateToken({ id: patient.id, type: 'patient' });
    const { password: _pass, ...safeData } = patient;

    res.json({
      message: 'Login exitoso',
      patient: safeData,
      token,
    });
  } catch (error) {
    console.error('Error en login patient:', error.message || error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
