const fs = require('fs');
const path = require('path');
const prisma = require('../config/database');
const { handlePrismaError } = require('../utils/accountEmail');

const SITE_URL = process.env.FRONTEND_URL || 'https://professionalsathome.com';
const CONTACT_FORM_ENDPOINT =
  process.env.CONTACT_FORM_URL || 'https://contact-form-service-e8aa.onrender.com/api/contact';

const removeFile = (assetPath) => {
  if (!assetPath || typeof assetPath !== 'string') return;
  const normalized = assetPath.replace(/^\/+/, '');
  const absolutePath = path.resolve(process.cwd(), normalized);
  if (fs.existsSync(absolutePath)) {
    try { fs.unlinkSync(absolutePath); } catch (_) {}
  }
};

const addMonths = (date, months) => {
  const value = new Date(date);
  value.setMonth(value.getMonth() + months);
  return value;
};

// ─── GET PROFILE ─────────────────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const psychologist = await prisma.psychologist.findUnique({
      where: { id: req.user.id },
      include: {
        documents: true,
        subscriptions: {
          where: { status: 'ACTIVE', endDate: { gte: new Date() } },
          orderBy: { endDate: 'desc' },
          take: 1,
        },
      },
    });

    if (!psychologist) {
      return res.status(404).json({ error: 'Psicólogo no encontrado' });
    }

    const { password, ...safe } = psychologist;
    res.json(safe);
  } catch (error) {
    console.error('Error en getProfile psychologist:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// ─── UPDATE PROFILE ──────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName, lastName, displayName, gender, dateOfBirth, phone, contactEmail, bio,
      // AR fields
      dni, cuitCuil, addressStreet, addressNumber, addressFloor, addressCity,
      addressProvince, addressPostalCode, practiceProvince,
      universityDegree, graduationYear, universityName, licenseNumber,
      licenseProvince, healthMinistryReg, virtualConsultingAuthorization,
      sessionCost, sessionDuration,
      // INTL fields
      documentType, documentNumber, taxId, country, region,
      licenseEntity, licenseCountry, degreeInstitution,
      // Shared professional
      specialties, ageRanges, yearsExperience, languages, remoteModality,
    } = req.body;

    const updated = await prisma.psychologist.update({
      where: { id: req.user.id },
      data: {
        firstName, lastName, displayName, gender, phone, contactEmail, bio,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        dni, cuitCuil, addressStreet, addressNumber, addressFloor, addressCity,
        addressProvince, addressPostalCode, practiceProvince,
        universityDegree,
        graduationYear: graduationYear ? Number(graduationYear) : undefined,
        universityName, licenseNumber, licenseProvince, healthMinistryReg,
        virtualConsultingAuthorization,
        sessionCost,
        sessionDuration,
        documentType, documentNumber, taxId, country, region,
        licenseEntity, licenseCountry, degreeInstitution,
        specialties: Array.isArray(specialties) ? specialties : undefined,
        ageRanges: Array.isArray(ageRanges) ? ageRanges : undefined,
        yearsExperience: yearsExperience ? Number(yearsExperience) : undefined,
        languages: Array.isArray(languages) ? languages : undefined,
        remoteModality,
      },
    });

    const { password, ...safe } = updated;
    res.json({ message: 'Perfil actualizado exitosamente', psychologist: safe });
  } catch (error) {
    console.error('Error en updateProfile psychologist:', error);
    const userMessage = error?.code?.startsWith('P')
      ? handlePrismaError(error, 'actualización de perfil')
      : 'Error al actualizar el perfil. Verificá los datos e intentá nuevamente.';
    res.status(500).json({ error: userMessage });
  }
};

// ─── UPLOAD PROFILE IMAGE ─────────────────────────────────────────────────────
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    }

    const current = await prisma.psychologist.findUnique({
      where: { id: req.user.id },
      select: { profileImage: true },
    });

    const profileImage = `/uploads/psychologist-profiles/${req.file.filename}`;

    await prisma.psychologist.update({
      where: { id: req.user.id },
      data: { profileImage },
    });

    if (current?.profileImage) {
      removeFile(current.profileImage);
    }

    res.json({ message: 'Foto de perfil actualizada', profileImage });
  } catch (error) {
    console.error('Error en uploadProfileImage psychologist:', error);
    res.status(500).json({ error: 'Error al subir imagen de perfil' });
  }
};

// ─── DELETE ACCOUNT ──────────────────────────────────────────────────────────
exports.deleteAccount = async (req, res) => {
  try {
    await prisma.psychologist.delete({
      where: { id: req.user.id },
    });

    res.json({ message: 'Cuenta eliminada exitosamente' });
  } catch (error) {
    console.error('Error en deleteAccount psychologist:', error);
    res.status(500).json({ error: 'Error al eliminar cuenta' });
  }
};

// ─── UPLOAD DOCUMENTS ─────────────────────────────────────────────────────────
// Accepts multiple files with field name 'psychologistDoc'
// Each file can have a documentType passed in req.body.documentTypes (JSON array)
exports.uploadDocuments = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No se han subido archivos' });
    }

    let documentTypes = [];
    try {
      documentTypes = JSON.parse(req.body.documentTypes || '[]');
    } catch (_) {
      documentTypes = [];
    }

    const created = await Promise.all(
      req.files.map((file, index) =>
        prisma.psychologistDocument.create({
          data: {
            psychologistId: req.user.id,
            documentType: documentTypes[index] || 'DOCUMENT',
            fileUrl: `/uploads/psychologist-docs/${file.filename}`,
            originalName: file.originalname,
          },
        })
      )
    );

    // Move status to PENDING once docs are uploaded
    const current = await prisma.psychologist.findUnique({
      where: { id: req.user.id },
      select: { status: true },
    });
    if (current?.status === 'PENDING_DOCS') {
      await prisma.psychologist.update({
        where: { id: req.user.id },
        data: { status: 'PENDING' },
      });
    }

    res.status(201).json({
      message: 'Documentos subidos. Tu solicitud está pendiente de verificación.',
      documents: created,
    });
  } catch (error) {
    console.error('Error en uploadDocuments psychologist:', error);
    res.status(500).json({ error: 'Error al subir documentos' });
  }
};

// ─── GET ACTIVE SUBSCRIPTION ──────────────────────────────────────────────────
exports.getSubscription = async (req, res) => {
  try {
    const subscription = await prisma.psychologistSubscription.findFirst({
      where: {
        psychologistId: req.user.id,
        status: 'ACTIVE',
        endDate: { gte: new Date() },
      },
      orderBy: { endDate: 'desc' },
    });

    if (!subscription) {
      return res.json({
        hasActiveSubscription: false,
        subscription: null,
      });
    }

    res.json({ subscription, hasActiveSubscription: true });
  } catch (error) {
    console.error('Error en getSubscription psychologist:', error);
    res.status(500).json({ error: 'Error al obtener suscripción' });
  }
};

// ─── CREATE SUBSCRIPTION ──────────────────────────────────────────────────────
exports.createSubscription = async (req, res) => {
  try {
    const { plan, currency, paymentId } = req.body;

    const startDate = new Date();
    let durationInMonths = 3;
    switch (plan) {
      case 'MONTHLY':   durationInMonths = 3;  break;
      case 'QUARTERLY': durationInMonths = 7;  break;
      case 'ANNUAL':    durationInMonths = 13; break;
      default:          durationInMonths = 3;
    }
    const endDate = addMonths(startDate, durationInMonths);

    // Expire previous active subscriptions
    await prisma.psychologistSubscription.updateMany({
      where: { psychologistId: req.user.id, status: 'ACTIVE' },
      data: { status: 'EXPIRED' },
    });

    const subscription = await prisma.psychologistSubscription.create({
      data: {
        psychologistId: req.user.id,
        plan,
        status: 'ACTIVE',
        startDate,
        endDate,
        amount: '0',
        currency: currency || 'USD',
        paymentId,
        paymentStatus: 'free',
        paymentMethod: 'free',
      },
    });

    // Activate the psychologist profile
    await prisma.psychologist.update({
      where: { id: req.user.id },
      data: { status: 'ACTIVE' },
    });

    res.status(201).json({
      message: 'Suscripción activada exitosamente',
      subscription,
    });
  } catch (error) {
    console.error('Error en createSubscription psychologist:', error);
    res.status(500).json({ error: 'Error al crear suscripción' });
  }
};

// ─── GET PLANS ────────────────────────────────────────────────────────────────
exports.getPlans = async (req, res) => {
  const isFreeMode = true;

  res.json({
    plans: [
      {
        id: 'MONTHLY',
        name: 'Plan 3 meses',
        price: 50,
        currency: 'USD',
        duration: '3 meses',
        isFreeMode,
        features: ['Solo por tiempo limitado', 'Plan bonificado', 'Perfil visible para pacientes'],
      },
      {
        id: 'QUARTERLY',
        name: 'Plan 7 meses',
        price: 80,
        currency: 'USD',
        duration: '7 meses',
        discount: 'Recomendado',
        isFreeMode,
        features: ['Solo por tiempo limitado', 'Plan bonificado', 'Cobertura extendida'],
      },
      {
        id: 'ANNUAL',
        name: 'Plan 12 + 1',
        price: 120,
        currency: 'USD',
        duration: '13 meses',
        discount: '1 mes gratis incluido',
        isFreeMode,
        features: ['Precio regular de referencia', 'Plan bonificado', 'Mayor continuidad anual'],
      },
    ],
  });
};

// ─── ADMIN: LIST PSYCHOLOGISTS ────────────────────────────────────────────────
exports.adminList = async (req, res) => {
  try {
    const { status, search, registrationType, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (registrationType) where.registrationType = registrationType;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
        { licenseNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const [total, psychologists] = await Promise.all([
      prisma.psychologist.count({ where }),
      prisma.psychologist.findMany({
        where,
        select: {
          id: true, email: true, firstName: true, lastName: true,
          displayName: true, registrationType: true, status: true,
          phone: true, contactEmail: true, country: true, licenseNumber: true,
          licenseProvince: true, licenseCountry: true, specialties: true,
          createdAt: true, approvedAt: true, rejectionReason: true,
          patientBlocks: { select: { blockedBy: true } },
          documents: { select: { id: true, documentType: true, fileUrl: true, originalName: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    res.json({
      total,
      page: pageNumber,
      limit: pageSize,
      psychologists,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error en adminList psychologists:', error);
    res.status(500).json({ error: 'Error al listar psicólogos' });
  }
};

// ─── ADMIN: APPROVE ───────────────────────────────────────────────────────────
exports.adminApprove = async (req, res) => {
  try {
    const { id } = req.params;

    const psychologist = await prisma.psychologist.findUnique({
      where: { id },
      include: { documents: { select: { id: true } } },
    });
    if (!psychologist) {
      return res.status(404).json({ error: 'Psicólogo no encontrado' });
    }
    if (psychologist.status === 'ACTIVE') {
      return res.status(400).json({ error: 'El psicólogo ya está activo' });
    }
    if (psychologist.status === 'PENDING_DOCS' || psychologist.documents.length === 0) {
      return res.status(400).json({ error: 'No se puede aprobar una cuenta sin documentación cargada' });
    }

    const updated = await prisma.psychologist.update({
      where: { id },
      data: { status: 'APPROVED', approvedAt: new Date(), rejectionReason: null },
    });

    // Send approval email
    const fullName = `${updated.firstName} ${updated.lastName}`;
    const loginUrl = `${SITE_URL}/psicologos/login`;
    try {
      await fetch(CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Professionals at Home',
          email: updated.email,
          to: updated.email,
          message: `Hola ${fullName},\n\nTu perfil de psicólogo en Professionals at Home fue aprobado.\n\nYa podés iniciar sesión y elegir tu plan de suscripción para aparecer en el listado de psicólogos:\n${loginUrl}\n\n¡Bienvenido/a a la plataforma!`,
          site: SITE_URL,
          company: '',
        }),
      });
    } catch (mailError) {
      console.warn('[mail] No se pudo enviar email de aprobación:', mailError.message);
    }

    const { password, ...safe } = updated;
    res.json({ message: 'Psicólogo aprobado exitosamente', psychologist: safe });
  } catch (error) {
    console.error('Error en adminApprove psychologist:', error);
    res.status(500).json({ error: 'Error al aprobar psicólogo' });
  }
};

// ─── ADMIN: REJECT ────────────────────────────────────────────────────────────
exports.adminReject = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const psychologist = await prisma.psychologist.findUnique({ where: { id } });
    if (!psychologist) {
      return res.status(404).json({ error: 'Psicólogo no encontrado' });
    }
    const updated = await prisma.psychologist.update({
      where: { id },
      data: { status: 'REJECTED', rejectionReason: reason || null },
    });

    // Send rejection/invalidation email
    const fullName = `${updated.firstName} ${updated.lastName}`;
    const emailIntro = psychologist.status === 'ACTIVE'
      ? 'Tu perfil de psicólogo en Professionals at Home fue pausado o invalidado por el equipo.'
      : 'Lamentablemente tu solicitud de registro como psicólogo en Professionals at Home no pudo ser aprobada.';
    try {
      await fetch(CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Professionals at Home',
          email: updated.email,
          to: updated.email,
          message: `Hola ${fullName},\n\n${emailIntro}${reason ? `\n\nMotivo: ${reason}` : ''}\n\nSi tenés dudas, podés comunicarte con nosotros respondiendo este correo.`,
          site: SITE_URL,
          company: '',
        }),
      });
    } catch (mailError) {
      console.warn('[mail] No se pudo enviar email de rechazo:', mailError.message);
    }

    const { password, ...safe } = updated;
    res.json({ message: 'Psicólogo rechazado', psychologist: safe });
  } catch (error) {
    console.error('Error en adminReject psychologist:', error);
    res.status(500).json({ error: 'Error al rechazar psicólogo' });
  }
};

// ─── ADMIN: DELETE ────────────────────────────────────────────────────────────
exports.adminDelete = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.psychologist.delete({
      where: { id },
    });

    res.json({ message: 'Psicólogo eliminado exitosamente' });
  } catch (error) {
    console.error('Error en adminDelete psychologist:', error);
    res.status(500).json({ error: 'Error al eliminar psicólogo' });
  }
};
