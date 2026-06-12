export const PHONE_CODE_OPTIONS = [
  { value: '+54 9', label: 'Argentina móvil', placeholder: '11 1234 5678' },
  { value: '+54', label: 'Argentina', placeholder: '11 1234 5678' },
  { value: '+598', label: 'Uruguay', placeholder: '99 123 456' },
  { value: '+56', label: 'Chile', placeholder: '9 1234 5678' },
  { value: '+55', label: 'Brasil', placeholder: '11 91234 5678' },
  { value: '+595', label: 'Paraguay', placeholder: '981 123 456' },
  { value: '+591', label: 'Bolivia', placeholder: '7123 4567' },
  { value: '+51', label: 'Perú', placeholder: '912 345 678' },
  { value: '+57', label: 'Colombia', placeholder: '310 123 4567' },
  { value: '+52', label: 'México', placeholder: '55 1234 5678' },
  { value: '+34', label: 'España', placeholder: '612 345 678' },
  { value: '+1', label: 'Estados Unidos / Canadá', placeholder: '555 000 0000' },
  { value: '+351', label: 'Portugal', placeholder: '912 000 111' },
  { value: '+39', label: 'Italia', placeholder: '312 345 6789' },
  { value: '+33', label: 'Francia', placeholder: '6 12 34 56 78' },
  { value: '+49', label: 'Alemania', placeholder: '151 2345 6789' },
  { value: '+44', label: 'Reino Unido', placeholder: '7700 900123' },
  { value: '+', label: 'Otro código', placeholder: 'código país + número' },
];

export const DEFAULT_PHONE_PREFIX = '+54 9';

export const digitsOnly = (value) => String(value || '').replace(/\D/g, '');

const compactSpaces = (value) => String(value || '').replace(/\s+/g, ' ').trim();

const getPrefixDigits = (prefix) => digitsOnly(prefix);

const prefixOptionsByLength = PHONE_CODE_OPTIONS
  .filter((option) => getPrefixDigits(option.value))
  .sort((a, b) => getPrefixDigits(b.value).length - getPrefixDigits(a.value).length);

export const getPhoneCodeOption = (prefix) =>
  PHONE_CODE_OPTIONS.find((option) => option.value === prefix) ||
  PHONE_CODE_OPTIONS.find((option) => option.value === DEFAULT_PHONE_PREFIX);

const getArgentinaAreaLength = (localDigits) => {
  if (localDigits.startsWith('11')) return 2;
  return 3;
};

const formatFromRight = (digits) => {
  const clean = digitsOnly(digits);
  if (clean.length <= 4) return clean;

  const last = clean.slice(-4);

  if (clean.length <= 8) {
    return `${clean.slice(0, -4)}-${last}`;
  }

  if (clean.length === 9) {
    return `${clean.slice(0, 2)} ${clean.slice(2, 5)}-${last}`;
  }

  if (clean.length === 10) {
    return `${clean.slice(0, 3)} ${clean.slice(3, 6)}-${last}`;
  }

  let rest = clean.slice(0, -4);
  const groups = [];

  while (rest.length > 3) {
    groups.unshift(rest.slice(-3));
    rest = rest.slice(0, -3);
  }

  if (rest) groups.unshift(rest);
  return `${groups.join(' ')}-${last}`;
};

export const formatLocalPhoneDigits = (value, prefix = DEFAULT_PHONE_PREFIX) => {
  const clean = digitsOnly(value);
  if (!clean) return '';

  if (prefix === '+54 9' || prefix === '+54') {
    const areaLength = getArgentinaAreaLength(clean);
    if (clean.length <= areaLength) return clean;

    const areaCode = clean.slice(0, areaLength);
    const subscriber = clean.slice(areaLength);
    return `${areaCode} ${formatFromRight(subscriber)}`.trim();
  }

  return formatFromRight(clean);
};

export const splitPhoneNumber = (value, fallbackPrefix = DEFAULT_PHONE_PREFIX) => {
  const raw = compactSpaces(value);
  const digits = digitsOnly(raw);

  if (!digits) {
    return {
      prefix: fallbackPrefix,
      localDigits: '',
    };
  }

  const matchedOption = prefixOptionsByLength.find((option) =>
    digits.startsWith(getPrefixDigits(option.value))
  );

  if (matchedOption) {
    return {
      prefix: matchedOption.value,
      localDigits: digits.slice(getPrefixDigits(matchedOption.value).length),
    };
  }

  return {
    prefix: '+',
    localDigits: digits,
  };
};

export const buildPhoneNumber = (prefix, localDigits) => {
  const cleanLocalDigits = digitsOnly(localDigits);
  const safePrefix = PHONE_CODE_OPTIONS.some((option) => option.value === prefix)
    ? prefix
    : DEFAULT_PHONE_PREFIX;

  if (!cleanLocalDigits) return '';

  if (safePrefix === '+') {
    return `+${formatLocalPhoneDigits(cleanLocalDigits, safePrefix)}`;
  }

  return `${safePrefix} ${formatLocalPhoneDigits(cleanLocalDigits, safePrefix)}`.trim();
};

export const normalizePhoneNumber = (value, fallbackPrefix = DEFAULT_PHONE_PREFIX) => {
  const raw = compactSpaces(value);
  if (!raw) return '';
  if (/[a-zA-Z]/.test(raw) || !raw.startsWith('+')) return raw;

  const { prefix, localDigits } = splitPhoneNumber(raw, fallbackPrefix);
  return buildPhoneNumber(prefix, localDigits);
};

export const getPhoneValidationMessage = (value, { required = false } = {}) => {
  const raw = compactSpaces(value);

  if (!raw) {
    return required ? 'Campo requerido' : '';
  }

  if (/[a-zA-Z]/.test(raw) || !raw.startsWith('+')) {
    return 'Ingresá un WhatsApp válido con código de zona';
  }

  const digits = digitsOnly(raw);
  const { prefix, localDigits } = splitPhoneNumber(raw);

  if (digits.length < 8 || digits.length > 15) {
    return 'Ingresá entre 8 y 15 números';
  }

  if ((prefix === '+54 9' || prefix === '+54') && localDigits.length !== 10) {
    return 'Ingresá código de área + número (10 dígitos)';
  }

  if (prefix !== '+' && localDigits.length < 6) {
    return 'Ingresá el número local completo';
  }

  return '';
};

export const isValidPhoneNumber = (value, options) =>
  !getPhoneValidationMessage(value, options);
