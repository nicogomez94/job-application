const prisma = require('../config/database');

// Obtener perfil de empresa
exports.getProfile = async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.user.id },
      include: {
        jobOffers: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        subscriptions: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
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
    console.error('Error en getProfile:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// Actualizar perfil de empresa
exports.updateProfile = async (req, res) => {
  try {
    const {
      companyName,
      description,
      website,
      location,
      industry,
      size,
    } = req.body;

    const updatedCompany = await prisma.company.update({
      where: { id: req.user.id },
      data: {
        companyName,
        description,
        website,
        location,
        industry,
        size,
      },
      select: {
        id: true,
        email: true,
        companyName: true,
        companyLogo: true,
        description: true,
        website: true,
        location: true,
        industry: true,
        size: true,
        isActive: true,
        isBlocked: true,
        updatedAt: true,
      },
    });

    res.json({
      message: 'Perfil actualizado exitosamente',
      company: updatedCompany,
    });
  } catch (error) {
    console.error('Error en updateProfile:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

// Subir logo de empresa
exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    }

    const companyLogo = `/uploads/logos/${req.file.filename}`;

    const updatedCompany = await prisma.company.update({
      where: { id: req.user.id },
      data: { companyLogo },
      select: {
        id: true,
        companyName: true,
        companyLogo: true,
      },
    });

    res.json({
      message: 'Logo actualizado exitosamente',
      companyLogo: updatedCompany.companyLogo,
    });
  } catch (error) {
    console.error('Error en uploadLogo:', error);
    res.status(500).json({ error: 'Error al subir logo' });
  }
};

// Verificar estado de suscripción
exports.checkSubscription = async (req, res) => {
  try {
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        companyId: req.user.id,
        status: 'ACTIVE',
        endDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        endDate: 'desc',
      },
    });

    const isBlocked = req.user.isBlocked || !activeSubscription;

    res.json({
      hasActiveSubscription: !!activeSubscription,
      subscription: activeSubscription,
      isBlocked,
    });
  } catch (error) {
    console.error('Error en checkSubscription:', error);
    res.status(500).json({ error: 'Error al verificar suscripción' });
  }
};

// Obtener historial de suscripciones
exports.getSubscriptionHistory = async (req, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { companyId: req.user.id },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(subscriptions);
  } catch (error) {
    console.error('Error en getSubscriptionHistory:', error);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
};

// Eliminar cuenta de empresa
exports.deleteAccount = async (req, res) => {
  try {
    await prisma.company.delete({
      where: { id: req.user.id },
    });

    res.json({ message: 'Cuenta eliminada exitosamente' });
  } catch (error) {
    console.error('Error en deleteAccount:', error);
    res.status(500).json({ error: 'Error al eliminar cuenta' });
  }
};
