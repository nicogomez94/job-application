const prisma = require('../config/database');
const addMonths = (date, months) => {
  const value = new Date(date);
  value.setMonth(value.getMonth() + months);
  return value;
};

// Crear suscripción (pago exitoso)
exports.createSubscription = async (req, res) => {
  try {
    const {
      plan,
      amount,
      currency,
      paymentId,
      paymentStatus,
      paymentMethod,
    } = req.body;

    // Determinar fecha de fin según el plan
    const startDate = new Date();
    let durationInMonths = 3;
    switch (plan) {
      case 'TRIAL':
        durationInMonths = 2;
        break;
      case 'MONTHLY':
        durationInMonths = 3;
        break;
      case 'QUARTERLY':
        durationInMonths = 7;
        break;
      case 'ANNUAL':
        durationInMonths = 13;
        break;
      default:
        durationInMonths = 3;
    }
    const endDate = addMonths(startDate, durationInMonths);

    // Desactivar suscripciones anteriores
    await prisma.subscription.updateMany({
      where: {
        companyId: req.user.id,
        status: 'ACTIVE',
      },
      data: {
        status: 'EXPIRED',
      },
    });

    // Crear nueva suscripción
    const subscription = await prisma.subscription.create({
      data: {
        companyId: req.user.id,
        plan,
        status: 'ACTIVE',
        startDate,
        endDate,
        amount,
        currency: currency || 'ARS',
        paymentId,
        paymentStatus,
        paymentMethod,
      },
    });

    // Desbloquear empresa
    await prisma.company.update({
      where: { id: req.user.id },
      data: { isBlocked: false },
    });

    res.status(201).json({
      message: 'Suscripción activada exitosamente',
      subscription,
    });
  } catch (error) {
    console.error('Error en createSubscription:', error);
    res.status(500).json({ error: 'Error al crear suscripción' });
  }
};

// Obtener suscripción activa
exports.getActiveSubscription = async (req, res) => {
  try {
    const subscription = await prisma.subscription.findFirst({
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

    if (!subscription) {
      return res.status(404).json({ 
        error: 'No tienes una suscripción activa',
        hasActiveSubscription: false,
      });
    }

    res.json({
      subscription,
      hasActiveSubscription: true,
    });
  } catch (error) {
    console.error('Error en getActiveSubscription:', error);
    res.status(500).json({ error: 'Error al obtener suscripción' });
  }
};

// Obtener todas las suscripciones de la empresa
exports.getCompanySubscriptions = async (req, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { companyId: req.user.id },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(subscriptions);
  } catch (error) {
    console.error('Error en getCompanySubscriptions:', error);
    res.status(500).json({ error: 'Error al obtener suscripciones' });
  }
};

// Cancelar suscripción
exports.cancelSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la suscripción pertenece a la empresa
    const subscription = await prisma.subscription.findFirst({
      where: {
        id,
        companyId: req.user.id,
      },
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Suscripción no encontrada' });
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });

    res.json({
      message: 'Suscripción cancelada exitosamente',
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error('Error en cancelSubscription:', error);
    res.status(500).json({ error: 'Error al cancelar suscripción' });
  }
};

// Webhook de Mercado Pago (para procesar pagos)
exports.mercadoPagoWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    // Procesar notificación de pago
    if (type === 'payment') {
      const paymentId = data.id;

      // Aquí deberías consultar la API de Mercado Pago para obtener
      // los detalles completos del pago
      // const payment = await mercadopago.payment.get(paymentId);

      // Actualizar suscripción según el estado del pago
      // Por ahora, esto es un ejemplo básico

      // Buscar suscripción por paymentId
      const subscription = await prisma.subscription.findUnique({
        where: { paymentId: paymentId.toString() },
      });

      if (subscription) {
        // Actualizar estado según el pago
        // await prisma.subscription.update(...)
      }
    }

    res.status(200).json({ message: 'Webhook procesado' });
  } catch (error) {
    console.error('Error en mercadoPagoWebhook:', error);
    res.status(500).json({ error: 'Error al procesar webhook' });
  }
};

// Obtener planes disponibles
exports.getPlans = async (req, res) => {
  try {
    // isFreeMode: cuando es true, el frontend activa el plan sin pago.
    // Cuando se integre Mercado Pago, cambiar isFreeMode a false en cada plan
    // y conectar el flujo de checkout en SelectPlan.jsx.
    const isFreeMode = true;

    const plans = [
      {
        id: 'MONTHLY',
        name: 'Plan 3 meses',
        price: 50,
        currency: 'USD',
        duration: '3 meses',
        isFreeMode,
        features: [
          'Solo por tiempo limitado',
          'Renovación paga al finalizar',
          'Acceso a gestión de postulantes',
        ],
      },
      {
        id: 'QUARTERLY',
        name: 'Plan 7 meses',
        price: 80,
        currency: 'USD',
        duration: '7 meses',
        discount: 'Más elegido',
        isFreeMode,
        features: [
          'Solo por tiempo limitado',
          'Renovación paga al finalizar',
          'Cobertura extendida para contrataciones',
        ],
      },
      {
        id: 'ANNUAL',
        name: 'Plan 12 + 1',
        price: 120,
        currency: 'USD',
        duration: '13 meses',
        discount: '1 mes gratis incluido',
        isFreeMode,
        features: [
          'Pagás 12 meses y usás 13',
          'Renovación paga al finalizar',
          'Mayor continuidad anual',
        ],
      },
    ];

    res.json({ plans });
  } catch (error) {
    console.error('Error en getPlans:', error);
    res.status(500).json({ error: 'Error al obtener planes' });
  }
};
