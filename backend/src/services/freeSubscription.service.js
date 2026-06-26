const prisma = require('../config/database');
const {
  areSubscriptionPaymentsEnabled,
  getPlan,
} = require('./subscriptionPlans.service');

const PLAN_LEVELS = {
  MONTHLY: 1,
  QUARTERLY: 2,
  ANNUAL: 3,
};

const addMonths = (date, months) => {
  const value = new Date(date);
  value.setMonth(value.getMonth() + months);
  return value;
};

const requireFreePlan = (accountType, planId) => {
  if (areSubscriptionPaymentsEnabled()) {
    const error = new Error('La activación gratuita está desactivada. Usá el checkout de Mercado Pago.');
    error.statusCode = 409;
    throw error;
  }

  const plan = getPlan(accountType, planId);
  if (!plan) {
    const error = new Error('Plan inválido');
    error.statusCode = 400;
    throw error;
  }

  if (!plan.isSelectable) {
    const error = new Error('Este plan no está disponible por el momento.');
    error.statusCode = 409;
    error.code = 'PLAN_NOT_AVAILABLE';
    throw error;
  }

  return plan;
};

const buildFreeSubscriptionData = (plan) => {
  const startDate = new Date();

  return {
    plan: plan.id,
    status: 'ACTIVE',
    startDate,
    endDate: addMonths(startDate, plan.durationMonths),
    amount: '0',
    currency: 'ARS',
    paymentStatus: 'free',
    paymentMethod: 'free',
    durationMonths: plan.durationMonths,
    billingAmount: '0',
    billingCurrency: 'ARS',
    billingFrequency: plan.durationMonths,
    billingFrequencyType: 'months',
  };
};

const activateFreeCompanyPlan = async ({ companyId, planId }) => {
  const plan = requireFreePlan('company', planId);

  const subscription = await prisma.$transaction(async (tx) => {
    await tx.subscription.updateMany({
      where: { companyId, status: 'ACTIVE' },
      data: { status: 'EXPIRED' },
    });
    await tx.subscription.updateMany({
      where: { companyId, status: 'PENDING' },
      data: { status: 'CANCELLED', paymentStatus: 'free_mode_enabled' },
    });

    const created = await tx.subscription.create({
      data: {
        ...buildFreeSubscriptionData(plan),
        companyId,
      },
    });

    await tx.company.update({
      where: { id: companyId },
      data: { isBlocked: false },
    });

    return created;
  });

  return { plan, subscription };
};

const activateFreePsychologistPlan = async ({ psychologistId, planId }) => {
  const plan = requireFreePlan('psychologist', planId);
  const psychologist = await prisma.psychologist.findUnique({
    where: { id: psychologistId },
    select: { id: true, status: true },
  });

  if (!psychologist) {
    const error = new Error('Psicólogo no encontrado');
    error.statusCode = 404;
    throw error;
  }

  if (!['APPROVED', 'ACTIVE', 'SUSPENDED'].includes(psychologist.status)) {
    const error = new Error('Tu documentación debe estar aprobada por el admin antes de activar un plan.');
    error.statusCode = 403;
    throw error;
  }

  const activeSubscription = await prisma.psychologistSubscription.findFirst({
    where: {
      psychologistId,
      status: 'ACTIVE',
      endDate: { gte: new Date() },
    },
    orderBy: { endDate: 'desc' },
  });

  if (activeSubscription && PLAN_LEVELS[planId] <= PLAN_LEVELS[activeSubscription.plan]) {
    const error = new Error('Solo podés cambiar a un plan superior al actual.');
    error.statusCode = 400;
    throw error;
  }

  const subscription = await prisma.$transaction(async (tx) => {
    await tx.psychologistSubscription.updateMany({
      where: { psychologistId, status: 'ACTIVE' },
      data: { status: 'EXPIRED' },
    });
    await tx.psychologistSubscription.updateMany({
      where: { psychologistId, status: 'PENDING' },
      data: { status: 'CANCELLED', paymentStatus: 'free_mode_enabled' },
    });

    const created = await tx.psychologistSubscription.create({
      data: {
        ...buildFreeSubscriptionData(plan),
        psychologistId,
      },
    });

    await tx.psychologist.update({
      where: { id: psychologistId },
      data: { status: 'ACTIVE' },
    });

    return created;
  });

  return { plan, subscription };
};

module.exports = {
  activateFreeCompanyPlan,
  activateFreePsychologistPlan,
};
