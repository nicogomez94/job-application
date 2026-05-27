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

/**
 * Traduce errores de Prisma a mensajes legibles para el usuario.
 * Cubre los códigos más frecuentes en operaciones de registro y actualización.
 */
const handlePrismaError = (error, context = 'operación') => {
  const code = error?.code;

  if (code === 'P2002') {
    // Unique constraint violation
    const fields = error?.meta?.target;
    if (fields && fields.includes('email')) {
      return 'El email ingresado ya está registrado. Usá otro email o iniciá sesión.';
    }
    const fieldNames = Array.isArray(fields) ? fields.join(', ') : 'un campo';
    return `Ya existe un registro con el mismo valor en: ${fieldNames}. Verificá los datos e intentá nuevamente.`;
  }

  if (code === 'P2025') {
    return `No se encontró el registro a actualizar. Puede que tu sesión haya expirado, intentá iniciar sesión nuevamente.`;
  }

  if (code === 'P2003') {
    return `Error de referencia: uno de los datos enviados no existe en el sistema.`;
  }

  if (code === 'P2000') {
    return `Uno de los campos enviados es demasiado largo. Verificá que los datos sean correctos.`;
  }

  if (code === 'P2006' || code === 'P2007') {
    return `El formato de algún dato es inválido. Verificá fechas y números.`;
  }

  // Generic fallback
  return `Error en la ${context}. Verificá los datos e intentá nuevamente.`;
};

module.exports = {
  normalizeEmail,
  findAccountByEmail,
  getEmailAlreadyRegisteredMessage,
  handlePrismaError,
};
