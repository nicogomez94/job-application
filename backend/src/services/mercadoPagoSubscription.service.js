const crypto = require('crypto');
const prisma = require('../config/database');
const {
  cancelPreapproval,
  createPreapproval,
  getAuthorizedPayment,
  getFrontendBackUrl,
  getPreapproval,
} = require('./mercadoPago.service');
const { requirePlanBilling } = require('./subscriptionPlans.service');

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

const isApprovedPreapprovalStatus = (status) =>
  ['authorized', 'active'].includes(String(status || '').toLowerCase());

const isCancelledPreapprovalStatus = (status) =>
  ['cancelled', 'canceled', 'paused'].includes(String(status || '').toLowerCase());

const isApprovedPayment = (authorizedPayment) => {
  const paymentStatus = authorizedPayment?.payment?.status;
  const invoiceStatus = authorizedPayment?.status;
  const summarized = authorizedPayment?.summarized;
  return (
    String(paymentStatus || '').toLowerCase() === 'approved' ||
    String(invoiceStatus || '').toLowerCase() === 'processed' ||
    String(summarized || '').toLowerCase() === 'processed'
  );
};

const toDateOrNull = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getPaymentDebitDate = (authorizedPayment) =>
  toDateOrNull(authorizedPayment?.debit_date)
  || toDateOrNull(authorizedPayment?.date_created)
  || new Date();

const buildExternalReference = (accountType, accountId, planId) =>
  `${accountType}:${accountId}:${planId}:${crypto.randomUUID()}`;

const createLocalPendingSubscription = async ({ accountType, account, plan }) => {
  const now = new Date();
  const externalReference = buildExternalReference(accountType, account.id, plan.id);
  const commonData = {
    plan: plan.id,
    status: 'PENDING',
    startDate: now,
    endDate: addMonths(now, plan.durationMonths),
    amount: String(plan.billing.amount),
    currency: plan.billing.currency,
    paymentStatus: 'pending',
    paymentMethod: 'mercadopago',
    durationMonths: plan.durationMonths,
    billingAmount: String(plan.billing.amount),
    billingCurrency: plan.billing.currency,
    billingFrequency: plan.durationMonths,
    billingFrequencyType: 'months',
    mercadoPagoExternalReference: externalReference,
    mercadoPagoStatus: 'pending',
  };

  if (accountType === 'company') {
    return prisma.subscription.create({
      data: {
        ...commonData,
        companyId: account.id,
      },
    });
  }

  return prisma.psychologistSubscription.create({
    data: {
      ...commonData,
      psychologistId: account.id,
    },
  });
};

const updateLocalSubscription = (accountType, id, data) => {
  if (accountType === 'company') {
    return prisma.subscription.update({ where: { id }, data });
  }
  return prisma.psychologistSubscription.update({ where: { id }, data });
};

const createCheckout = async ({ accountType, account, planId }) => {
  const plan = requirePlanBilling(accountType, planId);
  const localSubscription = await createLocalPendingSubscription({ accountType, account, plan });
  const isCompany = accountType === 'company';
  const reason = `${isCompany ? 'Professionals at Home' : 'Professionals at Home Psicólogos'} - ${plan.name}`;
  const backPath = isCompany
    ? '/company/subscription?checkout=pending'
    : '/psicologo/plan?checkout=pending';

  try {
    const preapproval = await createPreapproval({
      reason,
      externalReference: localSubscription.mercadoPagoExternalReference,
      payerEmail: account.email,
      transactionAmount: plan.billing.amount,
      currencyId: plan.billing.currency,
      frequency: plan.durationMonths,
      backUrl: getFrontendBackUrl(backPath),
    });

    const updatedSubscription = await updateLocalSubscription(accountType, localSubscription.id, {
      mercadoPagoPreapprovalId: preapproval.id,
      mercadoPagoStatus: preapproval.status || 'pending',
      mercadoPagoInitPoint: preapproval.init_point,
      nextPaymentDate: toDateOrNull(preapproval.next_payment_date),
    });

    return {
      checkoutUrl: preapproval.init_point,
      init_point: preapproval.init_point,
      preapprovalId: preapproval.id,
      subscription: updatedSubscription,
      plan,
    };
  } catch (error) {
    await updateLocalSubscription(accountType, localSubscription.id, {
      status: 'CANCELLED',
      paymentStatus: 'checkout_error',
      mercadoPagoStatus: 'checkout_error',
    }).catch(() => {});
    throw error;
  }
};

const createCompanyCheckout = ({ company, planId }) =>
  createCheckout({ accountType: 'company', account: company, planId });

const createPsychologistCheckout = async ({ psychologist, planId }) => {
  if (!['APPROVED', 'ACTIVE', 'SUSPENDED'].includes(psychologist.status)) {
    const error = new Error('Tu documentación debe estar aprobada por el admin antes de activar un plan.');
    error.statusCode = 403;
    throw error;
  }

  const activeSubscription = await prisma.psychologistSubscription.findFirst({
    where: {
      psychologistId: psychologist.id,
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

  return createCheckout({ accountType: 'psychologist', account: psychologist, planId });
};

const findLocalSubscriptionByPreapproval = async (preapproval) => {
  const preapprovalId = preapproval?.id;
  const externalReference = preapproval?.external_reference;
  const where = {
    OR: [
      ...(preapprovalId ? [{ mercadoPagoPreapprovalId: String(preapprovalId) }] : []),
      ...(externalReference ? [{ mercadoPagoExternalReference: String(externalReference) }] : []),
    ],
  };

  if (where.OR.length === 0) return null;

  const companySubscription = await prisma.subscription.findFirst({ where });
  if (companySubscription) {
    return { accountType: 'company', subscription: companySubscription };
  }

  const psychologistSubscription = await prisma.psychologistSubscription.findFirst({ where });
  if (psychologistSubscription) {
    return { accountType: 'psychologist', subscription: psychologistSubscription };
  }

  return null;
};

const cancelPreviousMercadoPagoSubscriptions = async ({ accountType, accountId, currentSubscriptionId }) => {
  const model = accountType === 'company' ? prisma.subscription : prisma.psychologistSubscription;
  const accountField = accountType === 'company' ? 'companyId' : 'psychologistId';
  const previous = await model.findMany({
    where: {
      [accountField]: accountId,
      status: 'ACTIVE',
      id: { not: currentSubscriptionId },
      mercadoPagoPreapprovalId: { not: null },
    },
    select: { id: true, mercadoPagoPreapprovalId: true },
  });

  for (const item of previous) {
    try {
      await cancelPreapproval(item.mercadoPagoPreapprovalId);
    } catch (error) {
      console.error('No se pudo cancelar preapproval anterior:', {
        accountType,
        subscriptionId: item.id,
        mercadoPagoPreapprovalId: item.mercadoPagoPreapprovalId,
        error: error.message,
      });
    }
  }
};

const activateCompanySubscription = async ({ subscription, preapproval }) => {
  const startDate = toDateOrNull(preapproval.date_created) || new Date();
  const endDate = addMonths(startDate, subscription.durationMonths || 3);

  await cancelPreviousMercadoPagoSubscriptions({
    accountType: 'company',
    accountId: subscription.companyId,
    currentSubscriptionId: subscription.id,
  });

  return prisma.$transaction(async (tx) => {
    await tx.subscription.updateMany({
      where: {
        companyId: subscription.companyId,
        status: 'ACTIVE',
        id: { not: subscription.id },
      },
      data: { status: 'EXPIRED' },
    });

    const updated = await tx.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'ACTIVE',
        startDate,
        endDate,
        amount: String(preapproval.auto_recurring?.transaction_amount || subscription.amount),
        currency: preapproval.auto_recurring?.currency_id || subscription.currency,
        paymentStatus: 'approved',
        paymentMethod: 'mercadopago',
        mercadoPagoPreapprovalId: preapproval.id,
        mercadoPagoStatus: preapproval.status,
        mercadoPagoInitPoint: preapproval.init_point || subscription.mercadoPagoInitPoint,
        nextPaymentDate: toDateOrNull(preapproval.next_payment_date),
        lastWebhookAt: new Date(),
      },
    });

    await tx.company.update({
      where: { id: subscription.companyId },
      data: { isBlocked: false },
    });

    return updated;
  });
};

const activatePsychologistSubscription = async ({ subscription, preapproval }) => {
  const startDate = toDateOrNull(preapproval.date_created) || new Date();
  const endDate = addMonths(startDate, subscription.durationMonths || 3);

  await cancelPreviousMercadoPagoSubscriptions({
    accountType: 'psychologist',
    accountId: subscription.psychologistId,
    currentSubscriptionId: subscription.id,
  });

  return prisma.$transaction(async (tx) => {
    await tx.psychologistSubscription.updateMany({
      where: {
        psychologistId: subscription.psychologistId,
        status: 'ACTIVE',
        id: { not: subscription.id },
      },
      data: { status: 'EXPIRED' },
    });

    const updated = await tx.psychologistSubscription.update({
      where: { id: subscription.id },
      data: {
        status: 'ACTIVE',
        startDate,
        endDate,
        amount: String(preapproval.auto_recurring?.transaction_amount || subscription.amount),
        currency: preapproval.auto_recurring?.currency_id || subscription.currency,
        paymentStatus: 'approved',
        paymentMethod: 'mercadopago',
        mercadoPagoPreapprovalId: preapproval.id,
        mercadoPagoStatus: preapproval.status,
        mercadoPagoInitPoint: preapproval.init_point || subscription.mercadoPagoInitPoint,
        nextPaymentDate: toDateOrNull(preapproval.next_payment_date),
        lastWebhookAt: new Date(),
      },
    });

    const currentPsychologist = await tx.psychologist.findUnique({
      where: { id: subscription.psychologistId },
      select: { status: true },
    });

    if (currentPsychologist?.status !== 'SUSPENDED') {
      await tx.psychologist.update({
        where: { id: subscription.psychologistId },
        data: { status: 'ACTIVE' },
      });
    }

    return updated;
  });
};

const updateLocalStatusFromPreapproval = async ({ accountType, subscription, preapproval }) => {
  if (isApprovedPreapprovalStatus(preapproval.status)) {
    return accountType === 'company'
      ? activateCompanySubscription({ subscription, preapproval })
      : activatePsychologistSubscription({ subscription, preapproval });
  }

  if (isCancelledPreapprovalStatus(preapproval.status)) {
    const updated = await updateLocalSubscription(accountType, subscription.id, {
      status: 'CANCELLED',
      paymentStatus: preapproval.status,
      mercadoPagoStatus: preapproval.status,
      lastWebhookAt: new Date(),
    });

    if (accountType === 'company') {
      await prisma.company.update({
        where: { id: subscription.companyId },
        data: { isBlocked: true },
      });
    } else {
      await prisma.psychologist.updateMany({
        where: {
          id: subscription.psychologistId,
          status: { in: ['ACTIVE', 'SUSPENDED'] },
        },
        data: { status: 'APPROVED' },
      });
    }

    return updated;
  }

  return updateLocalSubscription(accountType, subscription.id, {
    paymentStatus: preapproval.status || 'pending',
    mercadoPagoStatus: preapproval.status || 'pending',
    mercadoPagoInitPoint: preapproval.init_point || subscription.mercadoPagoInitPoint,
    nextPaymentDate: toDateOrNull(preapproval.next_payment_date),
    lastWebhookAt: new Date(),
  });
};

const handlePreapprovalWebhook = async (preapprovalId) => {
  const preapproval = await getPreapproval(preapprovalId);
  const local = await findLocalSubscriptionByPreapproval(preapproval);

  if (!local) {
    return { handled: false, reason: 'local_subscription_not_found', preapproval };
  }

  const subscription = await updateLocalStatusFromPreapproval({
    accountType: local.accountType,
    subscription: local.subscription,
    preapproval,
  });

  return {
    handled: true,
    accountType: local.accountType,
    subscription,
    preapproval,
  };
};

const findLocalSubscriptionByAuthorizedPayment = async (authorizedPayment) => {
  const preapprovalId = authorizedPayment?.preapproval_id;
  if (!preapprovalId) return null;

  const companySubscription = await prisma.subscription.findFirst({
    where: { mercadoPagoPreapprovalId: String(preapprovalId) },
  });
  if (companySubscription) {
    return { accountType: 'company', subscription: companySubscription };
  }

  const psychologistSubscription = await prisma.psychologistSubscription.findFirst({
    where: { mercadoPagoPreapprovalId: String(preapprovalId) },
  });
  if (psychologistSubscription) {
    return { accountType: 'psychologist', subscription: psychologistSubscription };
  }

  return null;
};

const upsertRecurringPayment = async ({ accountType, subscription, authorizedPayment }) => {
  const payment = authorizedPayment?.payment || {};
  const debitDate = getPaymentDebitDate(authorizedPayment);
  const data = {
    mercadoPagoPaymentId: payment.id ? String(payment.id) : null,
    mercadoPagoPreapprovalId: authorizedPayment.preapproval_id
      ? String(authorizedPayment.preapproval_id)
      : subscription.mercadoPagoPreapprovalId,
    accountType,
    status: payment.status || authorizedPayment.status || null,
    statusDetail: payment.status_detail || authorizedPayment.status_detail || null,
    amount: authorizedPayment.transaction_amount
      ? String(authorizedPayment.transaction_amount)
      : null,
    currency: authorizedPayment.currency_id || null,
    debitDate,
    rawPayload: authorizedPayment,
    subscriptionId: accountType === 'company' ? subscription.id : null,
    psychologistSubscriptionId: accountType === 'psychologist' ? subscription.id : null,
  };

  return prisma.mercadoPagoRecurringPayment.upsert({
    where: { mercadoPagoAuthorizedPaymentId: String(authorizedPayment.id) },
    update: data,
    create: {
      mercadoPagoAuthorizedPaymentId: String(authorizedPayment.id),
      ...data,
    },
  });
};

const extendSubscriptionFromPayment = async ({ accountType, subscription, authorizedPayment }) => {
  if (!isApprovedPayment(authorizedPayment)) {
    return updateLocalSubscription(accountType, subscription.id, {
      paymentId: authorizedPayment.payment?.id ? String(authorizedPayment.payment.id) : subscription.paymentId,
      paymentStatus: authorizedPayment.payment?.status || authorizedPayment.status || subscription.paymentStatus,
      lastWebhookAt: new Date(),
    });
  }

  const debitDate = getPaymentDebitDate(authorizedPayment);
  const candidateEndDate = addMonths(debitDate, subscription.durationMonths || 3);
  const currentEndDate = new Date(subscription.endDate);
  const nextEndDate = candidateEndDate > currentEndDate ? candidateEndDate : currentEndDate;

  const data = {
    status: 'ACTIVE',
    endDate: nextEndDate,
    paymentId: authorizedPayment.payment?.id ? String(authorizedPayment.payment.id) : subscription.paymentId,
    paymentStatus: authorizedPayment.payment?.status || 'approved',
    paymentMethod: 'mercadopago',
    amount: authorizedPayment.transaction_amount
      ? String(authorizedPayment.transaction_amount)
      : String(subscription.amount),
    currency: authorizedPayment.currency_id || subscription.currency,
    nextPaymentDate: toDateOrNull(authorizedPayment.next_payment_date) || subscription.nextPaymentDate,
    lastWebhookAt: new Date(),
  };

  const updated = await updateLocalSubscription(accountType, subscription.id, data);

  if (accountType === 'company') {
    await prisma.company.update({
      where: { id: subscription.companyId },
      data: { isBlocked: false },
    });
  } else {
    const psychologist = await prisma.psychologist.findUnique({
      where: { id: subscription.psychologistId },
      select: { status: true },
    });

    if (psychologist?.status !== 'SUSPENDED') {
      await prisma.psychologist.update({
        where: { id: subscription.psychologistId },
        data: { status: 'ACTIVE' },
      });
    }
  }

  return updated;
};

const handleAuthorizedPaymentWebhook = async (authorizedPaymentId) => {
  const authorizedPayment = await getAuthorizedPayment(authorizedPaymentId);
  const local = await findLocalSubscriptionByAuthorizedPayment(authorizedPayment);

  if (!local) {
    return { handled: false, reason: 'local_subscription_not_found', authorizedPayment };
  }

  const recurringPayment = await upsertRecurringPayment({
    accountType: local.accountType,
    subscription: local.subscription,
    authorizedPayment,
  });

  const subscription = await extendSubscriptionFromPayment({
    accountType: local.accountType,
    subscription: local.subscription,
    authorizedPayment,
  });

  return {
    handled: true,
    accountType: local.accountType,
    recurringPayment,
    subscription,
    authorizedPayment,
  };
};

const cancelSubscription = async ({ accountType, subscription }) => {
  if (subscription.mercadoPagoPreapprovalId) {
    await cancelPreapproval(subscription.mercadoPagoPreapprovalId);
  }

  const updated = await updateLocalSubscription(accountType, subscription.id, {
    status: 'CANCELLED',
    paymentStatus: 'cancelled',
    mercadoPagoStatus: 'cancelled',
    lastWebhookAt: new Date(),
  });

  if (accountType === 'company') {
    await prisma.company.update({
      where: { id: subscription.companyId },
      data: { isBlocked: true },
    });
  } else {
    await prisma.psychologist.updateMany({
      where: {
        id: subscription.psychologistId,
        status: { in: ['ACTIVE', 'SUSPENDED'] },
      },
      data: { status: 'APPROVED' },
    });
  }

  return updated;
};

module.exports = {
  addMonths,
  cancelSubscription,
  createCompanyCheckout,
  createPsychologistCheckout,
  handleAuthorizedPaymentWebhook,
  handlePreapprovalWebhook,
};
