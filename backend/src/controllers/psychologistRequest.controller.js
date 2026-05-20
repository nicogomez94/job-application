const prisma = require('../config/database');

// ─────────────────────────────────────────────────────────────────────────────
// USER ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/psychologists/requests
// Authenticated user sends a hiring request to a psychologist
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
        userId_psychologistId: {
          userId: req.user.id,
          psychologistId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Ya enviaste una solicitud a este psicólogo' });
    }

    const request = await prisma.psychologistRequest.create({
      data: {
        userId: req.user.id,
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
// Authenticated user lists all their requests
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await prisma.psychologistRequest.findMany({
      where: { userId: req.user.id },
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

    // Strip contact info from non-ACCEPTED requests
    const sanitized = requests.map((r) => {
      if (r.status !== 'ACCEPTED') {
        const { phone, contactEmail, ...psychologistWithoutContact } = r.psychologist;
        return { ...r, psychologist: psychologistWithoutContact };
      }
      return r;
    });

    res.json(sanitized);
  } catch (error) {
    console.error('Error en getMyRequests:', error);
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
};

// DELETE /api/psychologists/requests/:id
// Authenticated user cancels a PENDING request
exports.cancelRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await prisma.psychologistRequest.findFirst({
      where: { id, userId: req.user.id },
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
// Authenticated user gets private contact data if they have an ACCEPTED request
exports.getContactInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const acceptedRequest = await prisma.psychologistRequest.findFirst({
      where: {
        userId: req.user.id,
        psychologistId: id,
        status: 'ACCEPTED',
      },
    });

    if (!acceptedRequest) {
      return res.status(403).json({
        error: 'No tenés acceso a los datos de contacto de este psicólogo',
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
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(requests);
  } catch (error) {
    console.error('Error en getIncomingRequests:', error);
    res.status(500).json({ error: 'Error al obtener solicitudes entrantes' });
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
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    res.json({ message: 'Estado actualizado exitosamente', request: updated });
  } catch (error) {
    console.error('Error en updateRequestStatus:', error);
    res.status(500).json({ error: 'Error al actualizar solicitud' });
  }
};
