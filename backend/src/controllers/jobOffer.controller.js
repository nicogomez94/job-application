const prisma = require('../config/database');

// Crear oferta laboral
exports.createJobOffer = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      responsibilities,
      location,
      salaryMin,
      salaryMax,
      salaryPeriod,
      workType,
      workMode,
      experienceLevel,
      whatsappNumber,
      contactEmail,
      languages,
      categoryId,
      expiresAt,
    } = req.body;

    const jobOffer = await prisma.jobOffer.create({
      data: {
        title,
        description,
        requirements,
        responsibilities,
        location,
        salaryMin,
        salaryMax,
        salaryPeriod,
        workType,
        workMode,
        experienceLevel,
        whatsappNumber,
        contactEmail,
        languages,
        categoryId,
        companyId: req.user.id,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
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
    });

    res.status(201).json({
      message: 'Oferta creada exitosamente',
      jobOffer,
    });
  } catch (error) {
    console.error('Error en createJobOffer:', error);
    res.status(500).json({ error: 'Error al crear oferta' });
  }
};

// Obtener todas las ofertas de una empresa
exports.getCompanyJobOffers = async (req, res) => {
  try {
    const jobOffers = await prisma.jobOffer.findMany({
      where: { companyId: req.user.id },
      include: {
        category: true,
        _count: {
          select: { applications: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(jobOffers);
  } catch (error) {
    console.error('Error en getCompanyJobOffers:', error);
    res.status(500).json({ error: 'Error al obtener ofertas' });
  }
};

// Obtener una oferta específica
exports.getJobOfferById = async (req, res) => {
  try {
    const { id } = req.params;

    const jobOffer = await prisma.jobOffer.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
            companyLogo: true,
            location: true,
            description: true,
            website: true,
            industry: true,
            size: true,
          },
        },
        category: true,
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!jobOffer) {
      return res.status(404).json({ error: 'Oferta no encontrada' });
    }

    res.json(jobOffer);
  } catch (error) {
    console.error('Error en getJobOfferById:', error);
    res.status(500).json({ error: 'Error al obtener oferta' });
  }
};

// Actualizar oferta laboral
exports.updateJobOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      requirements,
      responsibilities,
      location,
      salaryMin,
      salaryMax,
      salaryPeriod,
      workType,
      workMode,
      experienceLevel,
      whatsappNumber,
      contactEmail,
      languages,
      categoryId,
      isActive,
      expiresAt,
    } = req.body;

    // Verificar que la oferta pertenece a esta empresa
    const existingOffer = await prisma.jobOffer.findFirst({
      where: { id, companyId: req.user.id },
    });

    if (!existingOffer) {
      return res.status(404).json({ error: 'Oferta no encontrada' });
    }

    const updatedJobOffer = await prisma.jobOffer.update({
      where: { id },
      data: {
        title,
        description,
        requirements,
        responsibilities,
        location,
        salaryMin,
        salaryMax,
        salaryPeriod,
        workType,
        workMode,
        experienceLevel,
        whatsappNumber,
        contactEmail,
        languages,
        categoryId,
        isActive,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
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
    });

    res.json({
      message: 'Oferta actualizada exitosamente',
      jobOffer: updatedJobOffer,
    });
  } catch (error) {
    console.error('Error en updateJobOffer:', error);
    res.status(500).json({ error: 'Error al actualizar oferta' });
  }
};

// Eliminar oferta laboral
exports.deleteJobOffer = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la oferta pertenece a esta empresa
    const existingOffer = await prisma.jobOffer.findFirst({
      where: { id, companyId: req.user.id },
    });

    if (!existingOffer) {
      return res.status(404).json({ error: 'Oferta no encontrada' });
    }

    await prisma.jobOffer.delete({
      where: { id },
    });

    res.json({ message: 'Oferta eliminada exitosamente' });
  } catch (error) {
    console.error('Error en deleteJobOffer:', error);
    res.status(500).json({ error: 'Error al eliminar oferta' });
  }
};

// Obtener postulantes de una oferta
exports.getJobOfferApplicants = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la oferta pertenece a esta empresa
    const jobOffer = await prisma.jobOffer.findFirst({
      where: { id, companyId: req.user.id },
    });

    if (!jobOffer) {
      return res.status(404).json({ error: 'Oferta no encontrada' });
    }

    const applications = await prisma.application.findMany({
      where: { jobOfferId: id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            profileImage: true,
            title: true,
            bio: true,
            experience: true,
            education: true,
            skills: true,
            cvUrl: true,
            location: true,
            linkedinUrl: true,
            portfolioUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      jobOffer: {
        id: jobOffer.id,
        title: jobOffer.title,
      },
      applications,
      total: applications.length,
    });
  } catch (error) {
    console.error('Error en getJobOfferApplicants:', error);
    res.status(500).json({ error: 'Error al obtener postulantes' });
  }
};

// Actualizar estado de postulación
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    // Verificar que la postulación corresponde a una oferta de esta empresa
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        jobOffer: {
          select: {
            companyId: true,
          },
        },
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Postulación no encontrada' });
    }

    if (application.jobOffer.companyId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.json({
      message: 'Estado actualizado exitosamente',
      application: updatedApplication,
    });
  } catch (error) {
    console.error('Error en updateApplicationStatus:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};

// ==================== BÚSQUEDA PÚBLICA ====================

// Buscar ofertas (público)
exports.searchJobOffers = async (req, res) => {
  try {
    const {
      search,
      location,
      categoryId,
      workType,
      workMode,
      experienceLevel,
      languages,
      page = 1,
      limit = 20,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } },
      ],
    };

    // Filtros
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (workType) {
      where.workType = workType;
    }

    if (workMode) {
      where.workMode = workMode;
    }

    if (experienceLevel) {
      where.experienceLevel = experienceLevel;
    }

    if (languages) {
      where.languages = {
        hasSome: Array.isArray(languages) ? languages : [languages],
      };
    }

    const [jobOffers, total] = await Promise.all([
      prisma.jobOffer.findMany({
        where,
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
          _count: {
            select: { applications: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: parseInt(limit),
      }),
      prisma.jobOffer.count({ where }),
    ]);

    res.json({
      jobOffers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error en searchJobOffers:', error);
    res.status(500).json({ error: 'Error al buscar ofertas' });
  }
};
