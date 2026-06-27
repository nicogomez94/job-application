const EMAIL_VALIDATION_MESSAGE =
  'Ingresá un email válido, con un dominio y una extensión correctos (por ejemplo: nombre@gmail.com)';

const LOCAL_PART_PATTERN = /^[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*$/i;
const DOMAIN_LABEL_PATTERN = /^[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?$/i;
const TOP_LEVEL_DOMAIN_PATTERN = /^[A-Z]{2,63}$/i;

const isValidEmail = (value) => {
  if (typeof value !== 'string') return false;

  const email = value.trim();
  if (!email || email.length > 254) return false;

  const parts = email.split('@');
  if (parts.length !== 2) return false;

  const [localPart, domain] = parts;
  if (!localPart || localPart.length > 64 || !LOCAL_PART_PATTERN.test(localPart)) return false;
  if (!domain || domain.length > 253) return false;

  const labels = domain.split('.');
  if (labels.length < 2) return false;
  if (!labels.every((label) => DOMAIN_LABEL_PATTERN.test(label))) return false;

  return TOP_LEVEL_DOMAIN_PATTERN.test(labels[labels.length - 1]);
};

module.exports = {
  EMAIL_VALIDATION_MESSAGE,
  isValidEmail,
};
