const fs = require('fs');
const path = require('path');
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
const { validateAndNormalizePhoneNumber } = require('../utils/phone');

const PATIENT_SELECT = {
  id: true,
  email: true,
  acceptTerms: true,
  acceptPrivacy: true,
  acceptAgreement: true,
  consentMetadata: true,
  firstName: true,
  lastName: true,
  gender: true,
  phone: true,
  profileImage: true,
  createdAt: true,
  updatedAt: true,
};

const VALID_GENDERS = new Set(['Hombre', 'Mujer', 'Otro']);

const removeFile = (assetPath) => {
  if (!assetPath || typeof assetPath !== 'string') return;
  const normalized = assetPath.replace(/^\/+/, '');
  const absolutePath = path.resolve(process.cwd(), normalized);
  if (fs.existsSync(absolutePath)) {
    try { fs.unlinkSync(absolutePath); } catch (_) {}
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, gender, phone, acceptTerms, acceptPrivacy, acceptAgreement } = req.body;

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
    if (gender && !VALID_GENDERS.has(gender)) {
      return res.status(400).json({ error: 'El género seleccionado es inválido.' });
    }

    const normalizedPhone = validateAndNormalizePhoneNumber(phone);
    if (!normalizedPhone.isValid) {
      return res.status(400).json({ error: normalizedPhone.error });
    }

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
        acceptTerms: true,
        acceptPrivacy: true,
        acceptAgreement: true,
        consentMetadata: buildConsentMetadata({ role: 'patient', req }),
        firstName,
        lastName,
        gender: gender || null,
        phone: normalizedPhone.value,
      },
      select: PATIENT_SELECT,
    });

    const token = generateToken({ id: patient.id, type: 'patient' });

    res.status(201).json({
      message: 'Paciente registrado exitosamente',
      patient,
      token,
    });
  } catch (error) {
    console.error('Error en register patient:', error);
    const userMessage = error?.code?.startsWith('P')
      ? handlePrismaError(error, 'registro')
      : 'Error al registrar paciente. Intentá nuevamente en unos minutos.';
    res.status(500).json({ error: userMessage });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { email, firstName, lastName, gender, phone, currentPassword, newPassword } = req.body;

    if (!email || !firstName || !lastName) {
      return res.status(400).json({ error: 'Email, nombre y apellido son obligatorios.' });
    }

    const normalizedEmail = normalizeEmail(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ error: 'El formato del email es inválido.' });
    }

    if (gender && !VALID_GENDERS.has(gender)) {
      return res.status(400).json({ error: 'El género seleccionado es inválido.' });
    }

    const normalizedPhone = validateAndNormalizePhoneNumber(phone);
    if (!normalizedPhone.isValid) {
      return res.status(400).json({ error: normalizedPhone.error });
    }

    const existingAccount = await findAccountByEmail(prisma, normalizedEmail, {
      excludeType: 'patient',
      excludeId: req.user.id,
    });
    if (existingAccount) {
      return res.status(400).json({ error: getEmailAlreadyRegisteredMessage(existingAccount) });
    }

    const data = {
      email: normalizedEmail,
      firstName,
      lastName,
      gender: gender || null,
      phone: normalizedPhone.value,
    };

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'La contraseña nueva debe tener al menos 6 caracteres.' });
      }
      if (!currentPassword) {
        return res.status(400).json({ error: 'Ingresá tu contraseña actual para cambiarla.' });
      }

      const currentPatient = await prisma.patient.findUnique({
        where: { id: req.user.id },
        select: { password: true },
      });
      const passwordMatch = await bcrypt.compare(currentPassword, currentPatient?.password || '');
      if (!passwordMatch) {
        return res.status(400).json({ error: 'La contraseña actual es incorrecta.' });
      }

      data.password = await bcrypt.hash(newPassword, 10);
    }

    const patient = await prisma.patient.update({
      where: { id: req.user.id },
      data,
      select: PATIENT_SELECT,
    });

    res.json({ message: 'Datos actualizados exitosamente', patient });
  } catch (error) {
    console.error('Error en updateProfile patient:', error);
    const userMessage = error?.code?.startsWith('P')
      ? handlePrismaError(error, 'actualización del perfil')
      : 'Error al actualizar datos. Intentá nuevamente en unos minutos.';
    res.status(500).json({ error: userMessage });
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

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    }

    const current = await prisma.patient.findUnique({
      where: { id: req.user.id },
      select: { profileImage: true },
    });

    const profileImage = `/uploads/patient-profiles/${req.file.filename}`;

    await prisma.patient.update({
      where: { id: req.user.id },
      data: { profileImage },
    });

    if (current?.profileImage) {
      removeFile(current.profileImage);
    }

    res.json({ message: 'Foto de perfil actualizada', profileImage });
  } catch (error) {
    console.error('Error en uploadProfileImage patient:', error);
    res.status(500).json({ error: 'Error al subir imagen de perfil' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await prisma.patient.delete({
      where: { id: req.user.id },
    });

    res.json({ message: 'Cuenta eliminada exitosamente' });
  } catch (error) {
    console.error('Error en deleteAccount patient:', error);
    res.status(500).json({ error: 'Error al eliminar cuenta' });
  }
};
