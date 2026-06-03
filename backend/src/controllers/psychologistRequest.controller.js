const prisma = require('../config/database');

const getBlockInfo = (block, viewerType) => {
  if (!block) return null;

  const blockedByMe =
    (viewerType === 'patient' && block.blockedBy === 'PATIENT') ||
    (viewerType === 'psychologist' && block.blockedBy === 'PSYCHOLOGIST');
  const blockedMe =
    (viewerType === 'patient' && block.blockedBy === 'PSYCHOLOGIST') ||
    (viewerType === 'psychologist' && block.blockedBy === 'PATIENT');

  return {
    id: block.id,
    blockedBy: block.blockedBy,
    blockedByMe,
    blockedMe,
    createdAt: block.createdAt,
    message: blockedByMe
      ? 'Bloqueaste a este usuario. Los datos de contacto ya no están disponibles.'
      : 'Este usuario te bloqueó. Ya no podés ver sus datos.',
  };
};

const keepPsychologistIdentityOnly = (psychologist) => {
  if (!psychologist) return psychologist;
  return {
    id: psychologist.id,
    firstName: psychologist.firstName,
    lastName: psychologist.lastName,
    displayName: psychologist.displayName,
  };
};

const keepPatientIdentityOnly = (patient) => {
  if (!patient) return patient;
  return {
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName,
  };
};

const TERMINATION_MESSAGE = 'El paciente desea finalizar la terapia por razones personales';

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/psychologists/requests
// Authenticated patient sends a hiring request to a psychologist
exports.sendRequest = async (req, res) => {
  try {
    const { psychologistId, message } = req.body;

    if (!psychologistId) {
      return res.status(400).json({ error: 'El id del psicólogo es requerido' });
    }

    // Verify the psychologist exists and is ACTIVE
    const psychologist = await prisma.psychologist.findFirst({
      where: { id: psychologistId, status: 'ACTIVE' },
      select: { id: true, firstName: true, lastName: true, displayName: true },
    });

    if (!psychologist) {
      return res.status(404).json({ error: 'Psicólogo no encontrado o no disponible' });
    }

    // Check for existing request
    const existing = await prisma.psychologistRequest.findUnique({
      where: {
        patientId_psychologistId: {
          patientId: req.user.id,
          psychologistId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Ya enviaste una solicitud a este psicólogo' });
    }

    const request = await prisma.psychologistRequest.create({
      data: {
        patientId: req.user.id,
        psychologistId,
        message: message || null,
        status: 'PENDING',
      },
      include: {
        psychologist: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            profileImage: true,
            specialties: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Solicitud enviada exitosamente',
      request,
    });
  } catch (error) {
    console.error('Error en sendRequest:', error);
    res.status(500).json({ error: 'Error al enviar solicitud' });
  }
};

// GET /api/psychologists/requests/mine
// Authenticated patient lists all their requests
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await prisma.psychologistRequest.findMany({
      where: { patientId: req.user.id },
      include: {
        psychologist: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            profileImage: true,
            specialties: true,
            languages: true,
            country: true,
            // Contact info only included when request is ACCEPTED (resolved below)
            phone: true,
            contactEmail: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const blocks = await prisma.psychologistPatientBlock.findMany({
      where: { patientId: req.user.id },
    });
    const blockByPsychologistId = new Map(blocks.map((block) => [block.psychologistId, block]));

    // Strip contact info from non-ACCEPTED requests and all data from blocked relationships.
    const sanitized = requests.map((r) => {
      const blockInfo = getBlockInfo(blockByPsychologistId.get(r.psychologistId), 'patient');
      if (blockInfo) {
        return {
          ...r,
          message: null,
          blockInfo,
          psychologist: keepPsychologistIdentityOnly(r.psychologist),
        };
      }

      if (r.status !== 'ACCEPTED') {
        const { phone, contactEmail, ...psychologistWithoutContact } = r.psychologist;
        return { ...r, psychologist: psychologistWithoutContact };
      }
      return { ...r, blockInfo: null };
    });

    res.json(sanitized);
  } catch (error) {
    console.error('Error en getMyRequests:', error);
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
};

// DELETE /api/psychologists/requests/:id
// Authenticated patient cancels a PENDING request
exports.cancelRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await prisma.psychologistRequest.findFirst({
      where: { id, patientId: req.user.id },
    });

    if (!request) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ error: 'Solo podés cancelar solicitudes pendientes' });
    }

    await prisma.psychologistRequest.delete({ where: { id } });

    res.json({ message: 'Solicitud cancelada exitosamente' });
  } catch (error) {
    console.error('Error en cancelRequest:', error);
    res.status(500).json({ error: 'Error al cancelar solicitud' });
  }
};

// GET /api/psychologists/:id/contact
// Authenticated patient gets private contact data if they have an ACCEPTED request
exports.getContactInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const acceptedRequest = await prisma.psychologistRequest.findFirst({
      where: {
        patientId: req.user.id,
        psychologistId: id,
        status: 'ACCEPTED',
      },
    });

    if (!acceptedRequest) {
      return res.status(403).json({
        error: 'No tenés acceso a los datos de contacto de este psicólogo',
      });
    }

    const block = await prisma.psychologistPatientBlock.findUnique({
      where: {
        patientId_psychologistId: {
          patientId: req.user.id,
          psychologistId: id,
        },
      },
    });

    if (block) {
      return res.status(403).json({
        error: 'No podés ver los datos de contacto porque esta relación está bloqueada',
        blockInfo: getBlockInfo(block, 'patient'),
      });
    }

    const psychologist = await prisma.psychologist.findFirst({
      where: { id, status: 'ACTIVE' },
      select: { phone: true, contactEmail: true },
    });

    if (!psychologist) {
      return res.status(404).json({ error: 'Psicólogo no encontrado' });
    }

    res.json({ phone: psychologist.phone, contactEmail: psychologist.contactEmail });
  } catch (error) {
    console.error('Error en getContactInfo:', error);
    res.status(500).json({ error: 'Error al obtener datos de contacto' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PSYCHOLOGIST ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/psychologists/me/requests
// Authenticated psychologist lists all incoming requests
exports.getIncomingRequests = async (req, res) => {
  try {
    const requests = await prisma.psychologistRequest.findMany({
      where: { psychologistId: req.user.id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            profileImage: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const blocks = await prisma.psychologistPatientBlock.findMany({
      where: { psychologistId: req.user.id },
    });
    const blockByPatientId = new Map(blocks.map((block) => [block.patientId, block]));

    const sanitized = requests.map((request) => {
      const blockInfo = getBlockInfo(blockByPatientId.get(request.patientId), 'psychologist');
      if (!blockInfo) {
        return { ...request, blockInfo: null };
      }

      return {
        ...request,
        message: null,
        blockInfo,
        patient: keepPatientIdentityOnly(request.patient),
      };
    });

    res.json(sanitized);
  } catch (error) {
    console.error('Error en getIncomingRequests:', error);
    res.status(500).json({ error: 'Error al obtener solicitudes entrantes' });
  }
};

// POST /api/psychologists/requests/:id/block
// Authenticated patient or psychologist blocks the other side after an accepted request.
exports.blockRelationship = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await prisma.psychologistRequest.findUnique({
      where: { id },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true },
        },
        psychologist: {
          select: { id: true, firstName: true, lastName: true, displayName: true },
        },
      },
    });

    if (!request) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    const isPatientOwner = req.user.type === 'patient' && request.patientId === req.user.id;
    const isPsychologistOwner = req.user.type === 'psychologist' && request.psychologistId === req.user.id;

    if (!isPatientOwner && !isPsychologistOwner) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    if (request.status !== 'ACCEPTED') {
      return res.status(400).json({
        error: 'Solo podés bloquear después de que la solicitud fue aceptada',
      });
    }

    const existingBlock = await prisma.psychologistPatientBlock.findUnique({
      where: {
        patientId_psychologistId: {
          patientId: request.patientId,
          psychologistId: request.psychologistId,
        },
      },
    });

    if (existingBlock) {
      return res.status(400).json({
        error: 'Esta relación ya está bloqueada',
        blockInfo: getBlockInfo(existingBlock, req.user.type),
      });
    }

    const block = await prisma.psychologistPatientBlock.create({
      data: {
        patientId: request.patientId,
        psychologistId: request.psychologistId,
        blockedBy: req.user.type === 'patient' ? 'PATIENT' : 'PSYCHOLOGIST',
      },
    });

    res.status(201).json({
      message: 'Usuario bloqueado correctamente',
      blockInfo: getBlockInfo(block, req.user.type),
      request: {
        ...request,
        message: null,
        blockInfo: getBlockInfo(block, req.user.type),
        patient: keepPatientIdentityOnly(request.patient),
        psychologist: keepPsychologistIdentityOnly(request.psychologist),
      },
    });
  } catch (error) {
    console.error('Error en blockRelationship:', error);
    res.status(500).json({ error: 'Error al bloquear usuario' });
  }
};

// DELETE /api/psychologists/requests/:id/block
// Authenticated patient or psychologist unblocks a relationship they blocked.
exports.unblockRelationship = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await prisma.psychologistRequest.findUnique({
      where: { id },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
        psychologist: {
          select: { id: true, firstName: true, lastName: true, displayName: true, profileImage: true, specialties: true, languages: true, country: true, phone: true, contactEmail: true },
        },
      },
    });

    if (!request) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    const isPatientOwner = req.user.type === 'patient' && request.patientId === req.user.id;
    const isPsychologistOwner = req.user.type === 'psychologist' && request.psychologistId === req.user.id;

    if (!isPatientOwner && !isPsychologistOwner) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const block = await prisma.psychologistPatientBlock.findUnique({
      where: {
        patientId_psychologistId: {
          patientId: request.patientId,
          psychologistId: request.psychologistId,
        },
      },
    });

    if (!block) {
      return res.status(404).json({ error: 'La relación no está bloqueada' });
    }

    const blockedByCurrentUser =
      (req.user.type === 'patient' && block.blockedBy === 'PATIENT') ||
      (req.user.type === 'psychologist' && block.blockedBy === 'PSYCHOLOGIST');

    if (!blockedByCurrentUser) {
      return res.status(403).json({ error: 'Solo puede desbloquear quien realizó el bloqueo' });
    }

    await prisma.psychologistPatientBlock.delete({ where: { id: block.id } });

    const responseRequest = { ...request, blockInfo: null };
    if (req.user.type === 'patient' && responseRequest.status !== 'ACCEPTED') {
      const { phone, contactEmail, ...psychologistWithoutContact } = responseRequest.psychologist;
      responseRequest.psychologist = psychologistWithoutContact;
    }

    res.json({
      message: 'Usuario desbloqueado correctamente',
      request: responseRequest,
    });
  } catch (error) {
    console.error('Error en unblockRelationship:', error);
    res.status(500).json({ error: 'Error al desbloquear usuario' });
  }
};

// POST /api/psychologists/requests/:id/termination
// Authenticated patient asks to end an accepted therapy relationship.
exports.requestTermination = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await prisma.psychologistRequest.findFirst({
      where: { id, patientId: req.user.id },
    });

    if (!request) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    if (request.status !== 'ACCEPTED') {
      return res.status(400).json({ error: 'Solo podés finalizar terapias aceptadas' });
    }

    const block = await prisma.psychologistPatientBlock.findUnique({
      where: {
        patientId_psychologistId: {
          patientId: request.patientId,
          psychologistId: request.psychologistId,
        },
      },
    });

    if (block) {
      return res.status(400).json({
        error: 'No podés finalizar desde una relación bloqueada',
        blockInfo: getBlockInfo(block, 'patient'),
      });
    }

    const updated = await prisma.psychologistRequest.update({
      where: { id },
      data: {
        message: TERMINATION_MESSAGE,
        terminationRequestedAt: new Date(),
        terminationAcceptedAt: null,
      },
      include: {
        psychologist: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            profileImage: true,
            specialties: true,
            languages: true,
            country: true,
            phone: true,
            contactEmail: true,
          },
        },
      },
    });

    res.json({
      message: 'Pedido de finalización enviado al profesional',
      request: { ...updated, blockInfo: null },
    });
  } catch (error) {
    console.error('Error en requestTermination:', error);
    res.status(500).json({ error: 'Error al pedir la finalización de terapia' });
  }
};

// PUT /api/psychologists/requests/:id/termination/accept
// Authenticated psychologist accepts a patient's termination request.
exports.acceptTermination = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await prisma.psychologistRequest.findFirst({
      where: { id, psychologistId: req.user.id },
    });

    if (!request) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    if (request.status !== 'ACCEPTED' || !request.terminationRequestedAt) {
      return res.status(400).json({ error: 'No hay pedido de finalización pendiente' });
    }

    const updated = await prisma.psychologistRequest.update({
      where: { id },
      data: { terminationAcceptedAt: new Date() },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true, profileImage: true },
        },
      },
    });

    res.json({
      message: 'Finalización de terapia aceptada',
      request: { ...updated, blockInfo: null },
    });
  } catch (error) {
    console.error('Error en acceptTermination:', error);
    res.status(500).json({ error: 'Error al aceptar la finalización de terapia' });
  }
};

// PUT /api/psychologists/requests/:id/status
// Authenticated psychologist accepts or rejects a request
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Estado inválido. Debe ser ACCEPTED o REJECTED' });
    }

    const request = await prisma.psychologistRequest.findUnique({
      where: { id },
    });

    if (!request) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    if (request.psychologistId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ error: 'Solo podés actualizar solicitudes pendientes' });
    }

    const updated = await prisma.psychologistRequest.update({
      where: { id },
      data: { status },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
      },
    });

    res.json({ message: 'Estado actualizado exitosamente', request: updated });
  } catch (error) {
    console.error('Error en updateRequestStatus:', error);
    res.status(500).json({ error: 'Error al actualizar solicitud' });
  }
};
