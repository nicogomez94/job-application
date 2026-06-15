const prisma = require('../config/database');
const {
  cancelSubscription: cancelMercadoPagoSubscription,
  createCompanyCheckout,
  handleAuthorizedPaymentWebhook,
  handlePreapprovalWebhook,
} = require('../services/mercadoPagoSubscription.service');
const { getPlans } = require('../services/subscriptionPlans.service');
const {
  getWebhookDataId,
  verifyWebhookSignature,
} = require('../services/mercadoPago.service');

// Crear suscripción directa: reemplazada por checkout/webhook de Mercado Pago.
exports.createSubscription = async (req, res) => {
  return res.status(410).json({
    error: 'La activación directa de planes fue reemplazada por Mercado Pago.',
    message: 'Usá el checkout para iniciar el pago recurrente del plan.',
  });
};

// Crear checkout recurrente de Mercado Pago para empresas
exports.createCheckout = async (req, res) => {
  try {
    const { plan } = req.body;
    const result = await createCompanyCheckout({
      company: req.user,
      planId: plan,
    });

    res.status(201).json({
      message: 'Checkout de Mercado Pago creado',
      ...result,
    });
  } catch (error) {
    console.error('Error en createCheckout subscription:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Error al crear checkout de Mercado Pago',
      details: process.env.NODE_ENV === 'development' ? error.mercadoPagoResponse : undefined,
    });
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

    const updatedSubscription = await cancelMercadoPagoSubscription({
      accountType: 'company',
      subscription,
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
    const signature = verifyWebhookSignature({
      headers: req.headers,
      query: req.query,
      body: req.body,
    });

    if (!signature.ok) {
      return res.status(401).json({ error: 'Firma de Mercado Pago inválida' });
    }

    const topic = req.body?.type || req.query?.type || req.query?.topic;
    const dataId = getWebhookDataId(req.query, req.body);

    if (!dataId) {
      return res.status(200).json({ message: 'Webhook sin data.id procesable' });
    }

    let result = null;
    if (topic === 'subscription_preapproval') {
      result = await handlePreapprovalWebhook(dataId);
    } else if (topic === 'subscription_authorized_payment') {
      result = await handleAuthorizedPaymentWebhook(dataId);
    } else {
      return res.status(200).json({
        message: 'Webhook ignorado',
        topic,
      });
    }

    res.status(200).json({ message: 'Webhook procesado', result });
  } catch (error) {
    console.error('Error en mercadoPagoWebhook:', error);
    res.status(error.statusCode || 500).json({ error: 'Error al procesar webhook' });
  }
};

// Obtener planes disponibles
exports.getPlans = async (req, res) => {
  try {
    res.json({ plans: getPlans('company') });
  } catch (error) {
    console.error('Error en getPlans:', error);
    res.status(500).json({ error: 'Error al obtener planes' });
  }
};
