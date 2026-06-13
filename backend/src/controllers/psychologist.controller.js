const fs = require('fs');
const path = require('path');
const prisma = require('../config/database');
const { handlePrismaError } = require('../utils/accountEmail');
const { validateAndNormalizePhoneNumber } = require('../utils/phone');

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

const PLAN_LEVELS = {
  MONTHLY: 1,
  QUARTERLY: 2,
  ANNUAL: 3,
};

const DOCUMENT_REVIEWED_STATUSES = new Set(['APPROVED', 'ACTIVE', 'SUSPENDED']);

const markDocumentsSubmittedIfNeeded = async (psychologistId) => {
  const current = await prisma.psychologist.findUnique({
    where: { id: psychologistId },
    select: { status: true },
  });

  if (current?.status === 'PENDING_DOCS' || current?.status === 'REJECTED') {
    await prisma.psychologist.update({
      where: { id: psychologistId },
      data: { status: 'PENDING', rejectionReason: null },
    });
    return 'PENDING';
  }

  return current?.status;
};

const getDocumentUploadMessage = (status) => {
  if (DOCUMENT_REVIEWED_STATUSES.has(status)) {
    return 'Documentos actualizados exitosamente.';
  }

  return 'Documentos subidos. Tu solicitud está pendiente de verificación.';
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

    const normalizedPhone = validateAndNormalizePhoneNumber(phone);
    if (!normalizedPhone.isValid) {
      return res.status(400).json({ error: normalizedPhone.error });
    }

    const updated = await prisma.psychologist.update({
      where: { id: req.user.id },
      data: {
        firstName, lastName, displayName, gender, phone: normalizedPhone.value, contactEmail, bio,
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

    const status = await markDocumentsSubmittedIfNeeded(req.user.id);

    res.status(201).json({
      message: getDocumentUploadMessage(status),
      documents: created,
      status,
    });
  } catch (error) {
    console.error('Error en uploadDocuments psychologist:', error);
    res.status(500).json({ error: 'Error al subir documentos' });
  }
};

// ─── REPLACE DOCUMENT ───────────────────────────────────────────────────────
exports.replaceDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    }

    const { id } = req.params;
    const currentDocument = await prisma.psychologistDocument.findFirst({
      where: { id, psychologistId: req.user.id },
    });

    if (!currentDocument) {
      removeFile(`/uploads/psychologist-docs/${req.file.filename}`);
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    const documentType = typeof req.body.documentType === 'string' && req.body.documentType.trim()
      ? req.body.documentType.trim()
      : currentDocument.documentType;

    const updatedDocument = await prisma.psychologistDocument.update({
      where: { id: currentDocument.id },
      data: {
        documentType,
        fileUrl: `/uploads/psychologist-docs/${req.file.filename}`,
        originalName: req.file.originalname,
      },
    });

    removeFile(currentDocument.fileUrl);

    const status = await markDocumentsSubmittedIfNeeded(req.user.id);

    res.json({
      message: getDocumentUploadMessage(status),
      document: updatedDocument,
      status,
    });
  } catch (error) {
    console.error('Error en replaceDocument psychologist:', error);
    res.status(500).json({ error: 'Error al reemplazar documento' });
  }
};

// ─── DELETE DOCUMENT ────────────────────────────────────────────────────────
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await prisma.psychologistDocument.findFirst({
      where: { id, psychologistId: req.user.id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    await prisma.psychologistDocument.delete({
      where: { id: document.id },
    });

    removeFile(document.fileUrl);

    const remainingDocuments = await prisma.psychologistDocument.count({
      where: { psychologistId: req.user.id },
    });
    const current = await prisma.psychologist.findUnique({
      where: { id: req.user.id },
      select: { status: true },
    });

    let status = current?.status;
    if (remainingDocuments === 0 && (status === 'PENDING' || status === 'REJECTED')) {
      const updated = await prisma.psychologist.update({
        where: { id: req.user.id },
        data: { status: 'PENDING_DOCS' },
        select: { status: true },
      });
      status = updated.status;
    }

    res.json({
      message: 'Documento eliminado exitosamente.',
      deletedDocumentId: document.id,
      status,
    });
  } catch (error) {
    console.error('Error en deleteDocument psychologist:', error);
    res.status(500).json({ error: 'Error al eliminar documento' });
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

    const activeSubscription = await prisma.psychologistSubscription.findFirst({
      where: {
        psychologistId: req.user.id,
        status: 'ACTIVE',
        endDate: { gte: new Date() },
      },
      orderBy: { endDate: 'desc' },
    });

    if (activeSubscription && PLAN_LEVELS[plan] <= PLAN_LEVELS[activeSubscription.plan]) {
      return res.status(400).json({
        error: 'Solo podés cambiar a un plan superior al actual.',
      });
    }

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

// ─── UPDATE AVAILABILITY ─────────────────────────────────────────────────────
exports.updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({ error: 'El estado de disponibilidad es requerido' });
    }

    const current = await prisma.psychologist.findUnique({
      where: { id: req.user.id },
      select: { status: true },
    });

    if (!current) {
      return res.status(404).json({ error: 'Psicólogo no encontrado' });
    }

    if (!['ACTIVE', 'SUSPENDED'].includes(current.status)) {
      return res.status(400).json({
        error: 'Solo podés suspender o reactivar un perfil activo.',
      });
    }

    const updated = await prisma.psychologist.update({
      where: { id: req.user.id },
      data: { status: isAvailable ? 'ACTIVE' : 'SUSPENDED' },
    });

    const { password, ...safe } = updated;
    res.json({
      message: isAvailable ? 'Servicio de consultas reactivado' : 'Servicio de consultas suspendido',
      psychologist: safe,
    });
  } catch (error) {
    console.error('Error en updateAvailability psychologist:', error);
    res.status(500).json({ error: 'Error al actualizar disponibilidad' });
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
      : 'Estamos considerando tu registro. Disculpe las molestias.';
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
