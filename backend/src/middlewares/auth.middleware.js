const passport = require('passport');

// Middleware genérico de autenticación JWT
const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (error) {
      return res.status(500).json({ error: 'Error de autenticación' });
    }
    if (!user) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

// Middleware para verificar tipo de usuario específico
const authorizeRole = (...allowedTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    
    if (!allowedTypes.includes(req.user.type)) {
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }
    
    next();
  };
};

// Middleware específico para usuarios
const authenticateUser = [
  authenticate,
  authorizeRole('user')
];

// Middleware específico para empresas
const authenticateCompany = [
  authenticate,
  authorizeRole('company')
];

// Middleware específico para administradores
const authenticateAdmin = [
  authenticate,
  authorizeRole('admin')
];

// Middleware para verificar si la empresa tiene suscripción activa
const checkActiveSubscription = async (req, res, next) => {
  try {
    const prisma = require('../config/database');
    
    if (req.user.type !== 'company') {
      return next();
    }

    // Buscar suscripción activa
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        companyId: req.user.id,
        status: 'ACTIVE',
        endDate: {
          gte: new Date(),
        },
      },
    });

    if (!activeSubscription) {
      // Bloquear empresa si no tiene suscripción activa
      await prisma.company.update({
        where: { id: req.user.id },
        data: { isBlocked: true },
      });

      return res.status(403).json({
        error: 'Suscripción inactiva o vencida',
        message: 'Necesitas una suscripción activa para realizar esta acción',
      });
    }

    req.subscription = activeSubscription;
    next();
  } catch (error) {
    console.error('Error verificando suscripción:', error);
    res.status(500).json({ error: 'Error al verificar suscripción' });
  }
};

module.exports = {
  authenticate,
  authorizeRole,
  authenticateUser,
  authenticateCompany,
  authenticateAdmin,
  checkActiveSubscription,
};
