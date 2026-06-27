const prisma = require('../config/database');
const { getDefaultFrontendUrl } = require('../config/frontend');
const {
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
} = require('../config/jwt');
const { sendEmailVerificationEmail } = require('./mail.service');
const { normalizeEmail } = require('../utils/accountEmail');

const VERIFIABLE_ACCOUNT_MODELS = {
  user: 'user',
  company: 'company',
  patient: 'patient',
  psychologist: 'psychologist',
};

const RESEND_COOLDOWN_MS = 60 * 1000;

const getAccountDelegate = (type) => {
  const model = VERIFIABLE_ACCOUNT_MODELS[type];
  return model ? prisma[model] : null;
};

const sendVerificationForAccount = async ({ id, type, email }) => {
  const delegate = getAccountDelegate(type);
  if (!delegate) throw new Error('Tipo de cuenta no verificable');

  const normalizedEmail = normalizeEmail(email);
  const token = generateEmailVerificationToken({ id, type, email: normalizedEmail });
  const frontendBaseUrl = getDefaultFrontendUrl();
  const verificationUrl = `${frontendBaseUrl}/verificar-email?token=${encodeURIComponent(token)}`;

  await sendEmailVerificationEmail({ to: normalizedEmail, verificationUrl });
  await delegate.update({
    where: { id },
    data: { emailVerificationSentAt: new Date() },
  });
};

const requestVerificationEmail = async ({ email, type }) => {
  const delegate = getAccountDelegate(type);
  if (!delegate) return { sent: false };

  const normalizedEmail = normalizeEmail(email);
  const account = await delegate.findFirst({
    where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
    select: {
      id: true,
      email: true,
      emailVerified: true,
      emailVerificationSentAt: true,
    },
  });

  if (!account || account.emailVerified) return { sent: false };

  const lastSentAt = account.emailVerificationSentAt?.getTime() || 0;
  if (Date.now() - lastSentAt < RESEND_COOLDOWN_MS) {
    return { sent: false, cooldown: true };
  }

  await sendVerificationForAccount({ id: account.id, type, email: account.email });
  return { sent: true };
};

const confirmEmailVerification = async (token) => {
  const decoded = verifyEmailVerificationToken(token);
  if (!decoded?.id || !decoded?.type || !decoded?.email) return null;

  const delegate = getAccountDelegate(decoded.type);
  if (!delegate) return null;

  const account = await delegate.findUnique({
    where: { id: decoded.id },
    select: { id: true, email: true, emailVerified: true },
  });
  if (!account || normalizeEmail(account.email) !== normalizeEmail(decoded.email)) return null;

  if (!account.emailVerified) {
    await delegate.update({
      where: { id: account.id },
      data: { emailVerified: true, emailVerifiedAt: new Date() },
    });
  }

  return { id: account.id, email: account.email, type: decoded.type, emailVerified: true };
};

module.exports = {
  VERIFIABLE_ACCOUNT_MODELS,
  sendVerificationForAccount,
  requestVerificationEmail,
  confirmEmailVerification,
};
