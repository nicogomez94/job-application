const ACCOUNT_TYPES = [
  { type: 'user', label: 'postulante', delegate: 'user' },
  { type: 'company', label: 'empresa', delegate: 'company' },
  { type: 'patient', label: 'paciente', delegate: 'patient' },
  { type: 'psychologist', label: 'psicólogo', delegate: 'psychologist' },
];

const normalizeEmail = (email) => (email || '').trim().toLowerCase();

const findAccountByEmail = async (prisma, email, { excludeType, excludeId } = {}) => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return null;

  for (const accountType of ACCOUNT_TYPES) {
    const account = await prisma[accountType.delegate].findFirst({
      where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
      select: { id: true, email: true },
    });

    if (!account) continue;
    if (accountType.type === excludeType && account.id === excludeId) continue;

    return {
      id: account.id,
      email: account.email,
      type: accountType.type,
      label: accountType.label,
    };
  }

  return null;
};

const getEmailAlreadyRegisteredMessage = (existingAccount) => {
  if (!existingAccount) return null;
  return `El email ya está registrado como ${existingAccount.label}. Usá otro email para crear esta cuenta.`;
};

module.exports = {
  normalizeEmail,
  findAccountByEmail,
  getEmailAlreadyRegisteredMessage,
};
