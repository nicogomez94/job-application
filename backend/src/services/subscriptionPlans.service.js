const CURRENCY_ID = process.env.MERCADO_PAGO_CURRENCY_ID || 'ARS';

const PLAN_DEFINITIONS = {
  company: {
    MONTHLY: {
      id: 'MONTHLY',
      name: 'Plan 3 meses',
      referencePrice: 50,
      referenceCurrency: 'USD',
      duration: '3 meses',
      durationMonths: 3,
      discount: null,
      envKeys: [
        'MERCADO_PAGO_COMPANY_PLAN_3_MONTHS_ARS',
        'MERCADO_PAGO_COMPANY_PLAN_3_MONTHS_TOTAL_ARS',
        'MERCADO_PAGO_COMPANY_PLAN_3_MONTHS_MONTHLY_ARS',
      ],
      features: [
        'Solo por tiempo limitado',
        'Renovación automática cada 3 meses',
        'Acceso a gestión de postulantes',
      ],
    },
    QUARTERLY: {
      id: 'QUARTERLY',
      name: 'Plan 7 meses',
      referencePrice: 80,
      referenceCurrency: 'USD',
      duration: '7 meses',
      durationMonths: 7,
      discount: 'Recomendado',
      envKeys: [
        'MERCADO_PAGO_COMPANY_PLAN_7_MONTHS_ARS',
        'MERCADO_PAGO_COMPANY_PLAN_7_MONTHS_TOTAL_ARS',
        'MERCADO_PAGO_COMPANY_PLAN_7_MONTHS_MONTHLY_ARS',
      ],
      features: [
        'Solo por tiempo limitado',
        'Renovación automática cada 7 meses',
        'Cobertura extendida para contrataciones',
      ],
    },
    ANNUAL: {
      id: 'ANNUAL',
      name: 'Plan 12 + 1',
      referencePrice: 120,
      referenceCurrency: 'USD',
      duration: '13 meses',
      durationMonths: 13,
      discount: '1 mes adicional incluido',
      envKeys: [
        'MERCADO_PAGO_COMPANY_PLAN_13_MONTHS_ARS',
        'MERCADO_PAGO_COMPANY_PLAN_13_MONTHS_TOTAL_ARS',
        'MERCADO_PAGO_COMPANY_PLAN_13_MONTHS_MONTHLY_ARS',
      ],
      features: [
        'Pagás 12 meses y usás 13',
        'Renovación automática cada 13 meses',
        'Mayor continuidad anual',
      ],
    },
  },
  psychologist: {
    MONTHLY: {
      id: 'MONTHLY',
      name: 'Plan 3 meses',
      referencePrice: 30,
      referenceCurrency: 'USD',
      duration: '3 meses',
      durationMonths: 3,
      discount: null,
      envKeys: [
        'MERCADO_PAGO_PSYCHOLOGIST_PLAN_3_MONTHS_ARS',
        'MERCADO_PAGO_PSYCHOLOGIST_PLAN_3_MONTHS_TOTAL_ARS',
        'MERCADO_PAGO_PSYCHOLOGIST_PLAN_3_MONTHS_MONTHLY_ARS',
      ],
      features: [
        'Perfil visible para pacientes',
        'Ideal para validar el servicio',
        'Renovación automática cada 3 meses',
      ],
    },
    QUARTERLY: {
      id: 'QUARTERLY',
      name: 'Plan 7 meses',
      referencePrice: 50,
      referenceCurrency: 'USD',
      duration: '7 meses',
      durationMonths: 7,
      discount: 'Recomendado',
      envKeys: [
        'MERCADO_PAGO_PSYCHOLOGIST_PLAN_7_MONTHS_ARS',
        'MERCADO_PAGO_PSYCHOLOGIST_PLAN_7_MONTHS_TOTAL_ARS',
        'MERCADO_PAGO_PSYCHOLOGIST_PLAN_7_MONTHS_MONTHLY_ARS',
      ],
      features: [
        'Mayor continuidad de publicaciones',
        'Mejor costo por mes',
        'Renovación automática cada 7 meses',
      ],
    },
    ANNUAL: {
      id: 'ANNUAL',
      name: 'Plan 12 + 1',
      referencePrice: 80,
      referenceCurrency: 'USD',
      duration: '13 meses',
      durationMonths: 13,
      discount: '1 mes adicional incluido',
      envKeys: [
        'MERCADO_PAGO_PSYCHOLOGIST_PLAN_13_MONTHS_ARS',
        'MERCADO_PAGO_PSYCHOLOGIST_PLAN_13_MONTHS_TOTAL_ARS',
        'MERCADO_PAGO_PSYCHOLOGIST_PLAN_13_MONTHS_MONTHLY_ARS',
      ],
      features: [
        '1 mes adicional incluido',
        'Cobertura anual extendida',
        'Renovación automática cada 13 meses',
      ],
    },
  },
};

const parseAmount = (rawValue) => {
  if (rawValue === undefined || rawValue === null || rawValue === '') return null;
  const normalized = String(rawValue).replace(',', '.').trim();
  const amount = Number(normalized);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
};

const getConfiguredAmount = (plan) => {
  for (const envKey of plan.envKeys) {
    const amount = parseAmount(process.env[envKey]);
    if (amount) {
      return { amount, envKey };
    }
  }

  return { amount: null, envKey: null };
};

const toPublicPlan = (plan) => {
  const { amount, envKey } = getConfiguredAmount(plan);

  return {
    id: plan.id,
    name: plan.name,
    price: plan.referencePrice,
    currency: plan.referenceCurrency,
    referencePrice: plan.referencePrice,
    referenceCurrency: plan.referenceCurrency,
    duration: plan.duration,
    durationMonths: plan.durationMonths,
    discount: plan.discount || undefined,
    isFreeMode: false,
    billing: {
      amount,
      currency: CURRENCY_ID,
      frequency: plan.durationMonths,
      frequencyType: 'months',
      configured: Boolean(amount),
      envKey,
    },
    features: plan.features,
  };
};

const getPlans = (accountType) => {
  const definitions = PLAN_DEFINITIONS[accountType];
  if (!definitions) return [];
  return Object.values(definitions).map(toPublicPlan);
};

const getPlan = (accountType, planId) => {
  const plan = PLAN_DEFINITIONS[accountType]?.[planId];
  if (!plan) return null;
  return toPublicPlan(plan);
};

const requirePlanBilling = (accountType, planId) => {
  const plan = getPlan(accountType, planId);
  if (!plan) {
    const error = new Error('Plan inválido');
    error.statusCode = 400;
    throw error;
  }

  if (!plan.billing.configured) {
    const error = new Error('El monto en ARS de este plan no está configurado.');
    error.statusCode = 500;
    error.code = 'PLAN_BILLING_NOT_CONFIGURED';
    throw error;
  }

  return plan;
};

module.exports = {
  CURRENCY_ID,
  getPlan,
  getPlans,
  requirePlanBilling,
};
