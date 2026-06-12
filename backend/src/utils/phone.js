const PHONE_PREFIXES = [
  '+54 9',
  '+54',
  '+598',
  '+56',
  '+55',
  '+595',
  '+591',
  '+51',
  '+57',
  '+52',
  '+34',
  '+1',
  '+351',
  '+39',
  '+33',
  '+49',
  '+44',
];

const digitsOnly = (value) => String(value || '').replace(/\D/g, '');
const compactSpaces = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const getPrefixDigits = (prefix) => digitsOnly(prefix);

const prefixesByLength = [...PHONE_PREFIXES].sort(
  (a, b) => getPrefixDigits(b).length - getPrefixDigits(a).length,
);

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

const getArgentinaAreaLength = (localDigits) => {
  if (localDigits.startsWith('11')) return 2;
  return 3;
};

const formatLocalPhoneDigits = (value, prefix) => {
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

const splitPhoneNumber = (value) => {
  const raw = compactSpaces(value);
  const digits = digitsOnly(raw);

  const matchedPrefix = prefixesByLength.find((prefix) =>
    digits.startsWith(getPrefixDigits(prefix))
  );

  if (matchedPrefix) {
    return {
      prefix: matchedPrefix,
      localDigits: digits.slice(getPrefixDigits(matchedPrefix).length),
    };
  }

  return {
    prefix: '+',
    localDigits: digits,
  };
};

const buildPhoneNumber = (prefix, localDigits) => {
  const cleanLocalDigits = digitsOnly(localDigits);
  if (!cleanLocalDigits) return '';

  if (prefix === '+') {
    return `+${formatLocalPhoneDigits(cleanLocalDigits, prefix)}`;
  }

  return `${prefix} ${formatLocalPhoneDigits(cleanLocalDigits, prefix)}`.trim();
};

const validateAndNormalizePhoneNumber = (value, { required = false } = {}) => {
  if (value === undefined) {
    return required
      ? { isValid: false, value: undefined, error: 'Campo requerido' }
      : { isValid: true, value: undefined, error: null };
  }

  const raw = compactSpaces(value);

  if (!raw) {
    return required
      ? { isValid: false, value: null, error: 'Campo requerido' }
      : { isValid: true, value: null, error: null };
  }

  if (/[a-zA-Z]/.test(raw) || !raw.startsWith('+') || (raw.match(/\+/g) || []).length > 1) {
    return {
      isValid: false,
      value: null,
      error: 'Ingresá un WhatsApp válido con código de zona.',
    };
  }

  if (/[^+\d\s().-]/.test(raw)) {
    return {
      isValid: false,
      value: null,
      error: 'Ingresá un WhatsApp válido, solo números y prefijo.',
    };
  }

  const digits = digitsOnly(raw);
  const { prefix, localDigits } = splitPhoneNumber(raw);

  if (digits.length < 8 || digits.length > 15) {
    return {
      isValid: false,
      value: null,
      error: 'Ingresá un teléfono válido de entre 8 y 15 números.',
    };
  }

  if ((prefix === '+54 9' || prefix === '+54') && localDigits.length !== 10) {
    return {
      isValid: false,
      value: null,
      error: 'Ingresá código de área + número (10 dígitos).',
    };
  }

  if (prefix !== '+' && localDigits.length < 6) {
    return {
      isValid: false,
      value: null,
      error: 'Ingresá el número local completo.',
    };
  }

  return {
    isValid: true,
    value: buildPhoneNumber(prefix, localDigits),
    error: null,
  };
};

module.exports = {
  validateAndNormalizePhoneNumber,
};
