const prisma = require('../config/database');

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
    const endDate = new Date();

    switch (plan) {
      case 'MONTHLY':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'QUARTERLY':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'ANNUAL':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      default:
        endDate.setMonth(endDate.getMonth() + 1);
    }

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
    const plans = [
      {
        id: 'MONTHLY',
        name: 'Plan Mensual',
        price: 9999,
        currency: 'ARS',
        duration: '1 mes',
        features: [
          'Publicar ofertas ilimitadas',
          'Ver postulantes',
          'Contacto por WhatsApp',
          'Soporte por email',
        ],
      },
      {
        id: 'QUARTERLY',
        name: 'Plan Trimestral',
        price: 24999,
        currency: 'ARS',
        duration: '3 meses',
        discount: '17% de descuento',
        features: [
          'Publicar ofertas ilimitadas',
          'Ver postulantes',
          'Contacto por WhatsApp',
          'Soporte prioritario',
        ],
      },
      {
        id: 'ANNUAL',
        name: 'Plan Anual',
        price: 89999,
        currency: 'ARS',
        duration: '12 meses',
        discount: '25% de descuento',
        features: [
          'Publicar ofertas ilimitadas',
          'Ver postulantes',
          'Contacto por WhatsApp',
          'Soporte prioritario',
          'Destacar ofertas',
        ],
      },
    ];

    res.json({ plans });
  } catch (error) {
    console.error('Error en getPlans:', error);
    res.status(500).json({ error: 'Error al obtener planes' });
  }
};
