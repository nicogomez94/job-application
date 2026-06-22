const CURRENCY_ID = process.env.MERCADO_PAGO_CURRENCY_ID || 'ARS';

const isEnabled = (value) => /^(true|1|yes|on)$/i.test(String(value || '').trim());

const areSubscriptionPaymentsEnabled = (accountType) => {
  const accountKey = accountType === 'psychologist'
    ? 'PSYCHOLOGIST_SUBSCRIPTION_PAYMENTS_ENABLED'
    : accountType === 'company'
      ? 'COMPANY_SUBSCRIPTION_PAYMENTS_ENABLED'
      : null;
  const accountValue = accountKey ? process.env[accountKey] : undefined;
  return accountValue === undefined
    ? isEnabled(process.env.SUBSCRIPTION_PAYMENTS_ENABLED)
    : isEnabled(accountValue);
};

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
      freeFeatures: [
        'Acceso gratuito durante 3 meses',
        'Publicación y gestión de postulantes',
        'No requiere tarjeta ni medio de pago',
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
      freeFeatures: [
        'Acceso gratuito durante 7 meses',
        'Cobertura extendida para contrataciones',
        'No requiere tarjeta ni medio de pago',
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
        'Solo por tiempo limitado',
        'Pagás 12 meses y usás 13',
        'Renovación automática cada 13 meses',
        'Mayor continuidad anual',
      ],
      freeFeatures: [
        'Acceso gratuito durante 13 meses',
        'Mayor continuidad anual',
        'No requiere tarjeta ni medio de pago',
      ],
    },
  },
  psychologist: {
    MONTHLY: {
      id: 'MONTHLY',
      name: 'Plan 3 meses',
      referencePrice: 40000,
      referenceCurrency: 'ARS',
      duration: '3 meses',
      durationMonths: 3,
      defaultBillingAmount: 40000,
      offerLabel: 'Por tiempo limitado',
      discount: null,
      envKeys: [
        'MERCADO_PAGO_PSYCHOLOGIST_PLAN_3_MONTHS_ARS',
        'MERCADO_PAGO_PSYCHOLOGIST_PLAN_3_MONTHS_TOTAL_ARS',
        'MERCADO_PAGO_PSYCHOLOGIST_PLAN_3_MONTHS_MONTHLY_ARS',
      ],
      features: [
        'Perfil visible para pacientes',
        'Sin comisión de ningún tipo',
        'Sin límite de consultas',
      ],
      freeFeatures: [
        'Perfil visible para pacientes durante 3 meses',
        'Ideal para empezar',
        'No requiere tarjeta ni medio de pago',
      ],
    },
    QUARTERLY: {
      id: 'QUARTERLY',
      name: 'Plan 6 + 1 meses',
      referencePrice: 75000,
      referenceCurrency: 'ARS',
      duration: '6 + 1 meses',
      durationMonths: 7,
      defaultBillingAmount: 75000,
      offerLabel: 'Por tiempo limitado',
      discount: 'Recomendado',
      envKeys: [
        'MERCADO_PAGO_PSYCHOLOGIST_PLAN_7_MONTHS_ARS',
        'MERCADO_PAGO_PSYCHOLOGIST_PLAN_7_MONTHS_TOTAL_ARS',
        'MERCADO_PAGO_PSYCHOLOGIST_PLAN_7_MONTHS_MONTHLY_ARS',
      ],
      features: [
        'Mayor continuidad de publicaciones',
        'Sin comisión de ningún tipo',
        'Sin límite de consultas',
      ],
      freeFeatures: [
        'Perfil visible para pacientes durante 7 meses',
        'Mayor continuidad de publicaciones',
        'No requiere tarjeta ni medio de pago',
      ],
    },
    ANNUAL: {
      id: 'ANNUAL',
      name: 'Plan 12 + 1',
      referencePrice: 135000,
      referenceCurrency: 'ARS',
      duration: '12 + 1 meses',
      durationMonths: 13,
      defaultBillingAmount: 135000,
      offerLabel: 'Por tiempo limitado',
      discount: '1 mes adicional incluido',
      envKeys: [
        'MERCADO_PAGO_PSYCHOLOGIST_PLAN_13_MONTHS_ARS',
        'MERCADO_PAGO_PSYCHOLOGIST_PLAN_13_MONTHS_TOTAL_ARS',
        'MERCADO_PAGO_PSYCHOLOGIST_PLAN_13_MONTHS_MONTHLY_ARS',
      ],
      features: [
        '1 mes adicional incluido',
        'Sin comisión de ningún tipo',
        'Sin límite de consultas',
      ],
      freeFeatures: [
        'Perfil visible para pacientes durante 13 meses',
        'Cobertura anual extendida',
        'No requiere tarjeta ni medio de pago',
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
  if (plan.defaultBillingAmount) {
    return { amount: parseAmount(plan.defaultBillingAmount), envKey: 'plan-default' };
  }

  for (const envKey of plan.envKeys) {
    const amount = parseAmount(process.env[envKey]);
    if (amount) {
      return { amount, envKey };
    }
  }

  return { amount: null, envKey: null };
};

const toPublicPlan = (plan, accountType) => {
  const paymentsEnabled = areSubscriptionPaymentsEnabled(accountType);
  const { amount, envKey } = getConfiguredAmount(plan);

  return {
    id: plan.id,
    name: plan.name,
    price: paymentsEnabled ? plan.referencePrice : null,
    currency: paymentsEnabled ? plan.referenceCurrency : null,
    referencePrice: paymentsEnabled ? plan.referencePrice : null,
    referenceCurrency: paymentsEnabled ? plan.referenceCurrency : null,
    duration: plan.duration,
    durationMonths: plan.durationMonths,
    discount: plan.discount || undefined,
    offerLabel: plan.offerLabel || undefined,
    isFreeMode: !paymentsEnabled,
    paymentsEnabled,
    billing: paymentsEnabled
      ? {
          amount,
          currency: CURRENCY_ID,
          frequency: plan.durationMonths,
          frequencyType: 'months',
          configured: Boolean(amount),
          envKey,
        }
      : null,
    features: paymentsEnabled ? plan.features : plan.freeFeatures,
  };
};

const getPlans = (accountType) => {
  const definitions = PLAN_DEFINITIONS[accountType];
  if (!definitions) return [];
  return Object.values(definitions).map((plan) => toPublicPlan(plan, accountType));
};

const getPlan = (accountType, planId) => {
  const plan = PLAN_DEFINITIONS[accountType]?.[planId];
  if (!plan) return null;
  return toPublicPlan(plan, accountType);
};

const requirePlanBilling = (accountType, planId) => {
  const plan = getPlan(accountType, planId);
  if (!plan) {
    const error = new Error('Plan inválido');
    error.statusCode = 400;
    throw error;
  }

  if (!areSubscriptionPaymentsEnabled()) {
    const error = new Error('Los pagos de suscripciones están desactivados. Activá el plan gratuito.');
    error.statusCode = 409;
    error.code = 'SUBSCRIPTION_PAYMENTS_DISABLED';
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
  areSubscriptionPaymentsEnabled,
  getPlan,
  getPlans,
  requirePlanBilling,
};
