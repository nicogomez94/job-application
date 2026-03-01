const prisma = require('../config/database');
const bcrypt = require('bcryptjs');

// ==================== DASHBOARD ====================

// Obtener métricas del dashboard
exports.getDashboardMetrics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCompanies,
      totalJobOffers,
      totalApplications,
      activeSubscriptions,
      recentUsers,
      recentCompanies,
      recentJobOffers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.company.count(),
      prisma.jobOffer.count(),
      prisma.application.count(),
      prisma.subscription.count({
        where: {
          status: 'ACTIVE',
          endDate: { gte: new Date() },
        },
      }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
        },
      }),
      prisma.company.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          companyName: true,
          isActive: true,
          isBlocked: true,
          createdAt: true,
        },
      }),
      prisma.jobOffer.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          company: {
            select: {
              companyName: true,
            },
          },
          _count: {
            select: { applications: true },
          },
        },
      }),
    ]);

    res.json({
      metrics: {
        totalUsers,
        totalCompanies,
        totalJobOffers,
        totalApplications,
        activeSubscriptions,
      },
      recent: {
        users: recentUsers,
        companies: recentCompanies,
        jobOffers: recentJobOffers,
      },
    });
  } catch (error) {
    console.error('Error en getDashboardMetrics:', error);
    res.status(500).json({ error: 'Error al obtener métricas' });
  }
};

// ==================== GESTIÓN DE USUARIOS ====================

// Listar todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          profileImage: true,
          title: true,
          location: true,
          createdAt: true,
          _count: {
            select: { applications: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Obtener usuario específico
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        applications: {
          include: {
            jobOffer: {
              include: {
                company: {
                  select: {
                    companyName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Remover password
    const { password, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error en getUserById:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error en deleteUser:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

// ==================== GESTIÓN DE EMPRESAS ====================

// Listar todas las empresas
exports.getAllCompanies = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        select: {
          id: true,
          email: true,
          companyName: true,
          companyLogo: true,
          location: true,
          industry: true,
          isActive: true,
          isBlocked: true,
          createdAt: true,
          _count: {
            select: {
              jobOffers: true,
              subscriptions: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.company.count({ where }),
    ]);

    res.json({
      companies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error en getAllCompanies:', error);
    res.status(500).json({ error: 'Error al obtener empresas' });
  }
};

// Obtener empresa específica
exports.getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        jobOffers: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        subscriptions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!company) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    // Remover password
    const { password, ...companyWithoutPassword } = company;

    res.json(companyWithoutPassword);
  } catch (error) {
    console.error('Error en getCompanyById:', error);
    res.status(500).json({ error: 'Error al obtener empresa' });
  }
};

// Bloquear/Desbloquear empresa
exports.toggleCompanyBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    const company = await prisma.company.update({
      where: { id },
      data: { isBlocked },
      select: {
        id: true,
        companyName: true,
        isBlocked: true,
      },
    });

    res.json({
      message: `Empresa ${isBlocked ? 'bloqueada' : 'desbloqueada'} exitosamente`,
      company,
    });
  } catch (error) {
    console.error('Error en toggleCompanyBlock:', error);
    res.status(500).json({ error: 'Error al actualizar empresa' });
  }
};

// Eliminar empresa
exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.company.delete({
      where: { id },
    });

    res.json({ message: 'Empresa eliminada exitosamente' });
  } catch (error) {
    console.error('Error en deleteCompany:', error);
    res.status(500).json({ error: 'Error al eliminar empresa' });
  }
};

// ==================== GESTIÓN DE SUSCRIPCIONES ====================

// Listar todas las suscripciones
exports.getAllSubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) {
      where.status = status;
    }

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              companyName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.subscription.count({ where }),
    ]);

    res.json({
      subscriptions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error en getAllSubscriptions:', error);
    res.status(500).json({ error: 'Error al obtener suscripciones' });
  }
};

// ==================== GESTIÓN DE OFERTAS ====================

// Listar todas las ofertas
exports.getAllJobOffers = async (req, res) => {
  try {
    const { page = 1, limit = 20, isActive } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [jobOffers, total] = await Promise.all([
      prisma.jobOffer.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              companyName: true,
            },
          },
          category: true,
          _count: {
            select: { applications: true },
          },
        },
        orderBy: { createdAt: 'desc' },
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
    console.error('Error en getAllJobOffers:', error);
    res.status(500).json({ error: 'Error al obtener ofertas' });
  }
};

// Eliminar oferta
exports.deleteJobOffer = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.jobOffer.delete({
      where: { id },
    });

    res.json({ message: 'Oferta eliminada exitosamente' });
  } catch (error) {
    console.error('Error en deleteJobOffer:', error);
    res.status(500).json({ error: 'Error al eliminar oferta' });
  }
};

// ==================== GESTIÓN DE ADMINISTRADORES ====================

// Crear administrador
exports.createAdmin = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Verificar si el email ya existe
    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'ADMIN',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: 'Administrador creado exitosamente',
      admin,
    });
  } catch (error) {
    console.error('Error en createAdmin:', error);
    res.status(500).json({ error: 'Error al crear administrador' });
  }
};
