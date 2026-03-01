const prisma = require('../config/database');

// Postular a una oferta
exports.applyToJob = async (req, res) => {
  try {
    const { jobOfferId } = req.params;
    const { coverLetter } = req.body;

    // Verificar que la oferta existe y está activa
    const jobOffer = await prisma.jobOffer.findUnique({
      where: { id: jobOfferId },
    });

    if (!jobOffer) {
      return res.status(404).json({ error: 'Oferta no encontrada' });
    }

    if (!jobOffer.isActive) {
      return res.status(400).json({ error: 'Esta oferta ya no está activa' });
    }

    // Verificar si ya se postuló
    const existingApplication = await prisma.application.findUnique({
      where: {
        userId_jobOfferId: {
          userId: req.user.id,
          jobOfferId,
        },
      },
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'Ya te has postulado a esta oferta' });
    }

    // Crear postulación
    const application = await prisma.application.create({
      data: {
        userId: req.user.id,
        jobOfferId,
        coverLetter,
        status: 'PENDING',
      },
      include: {
        jobOffer: {
          include: {
            company: {
              select: {
                id: true,
                companyName: true,
                companyLogo: true,
              },
            },
            category: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Postulación enviada exitosamente',
      application,
    });
  } catch (error) {
    console.error('Error en applyToJob:', error);
    res.status(500).json({ error: 'Error al postular' });
  }
};

// Obtener una postulación específica
exports.getApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        jobOffer: {
          include: {
            company: {
              select: {
                id: true,
                companyName: true,
                companyLogo: true,
                location: true,
              },
            },
            category: true,
          },
        },
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Postulación no encontrada' });
    }

    // Verificar que la postulación pertenece al usuario
    if (application.userId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error en getApplication:', error);
    res.status(500).json({ error: 'Error al obtener postulación' });
  }
};

// Cancelar postulación
exports.cancelApplication = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la postulación existe y pertenece al usuario
    const application = await prisma.application.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Postulación no encontrada' });
    }

    await prisma.application.delete({
      where: { id },
    });

    res.json({ message: 'Postulación cancelada exitosamente' });
  } catch (error) {
    console.error('Error en cancelApplication:', error);
    res.status(500).json({ error: 'Error al cancelar postulación' });
  }
};

// Actualizar carta de presentación
exports.updateCoverLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const { coverLetter } = req.body;

    // Verificar que la postulación existe y pertenece al usuario
    const application = await prisma.application.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Postulación no encontrada' });
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { coverLetter },
      include: {
        jobOffer: {
          include: {
            company: {
              select: {
                companyName: true,
                companyLogo: true,
              },
            },
          },
        },
      },
    });

    res.json({
      message: 'Carta de presentación actualizada',
      application: updatedApplication,
    });
  } catch (error) {
    console.error('Error en updateCoverLetter:', error);
    res.status(500).json({ error: 'Error al actualizar carta' });
  }
};
