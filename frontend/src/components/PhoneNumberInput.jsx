import { useEffect, useId, useMemo, useState } from 'react';
import {
  DEFAULT_PHONE_PREFIX,
  PHONE_CODE_OPTIONS,
  buildPhoneNumber,
  digitsOnly,
  formatLocalPhoneDigits,
  getPhoneCodeOption,
  splitPhoneNumber,
} from '../utils/phoneNumber';
import './PhoneNumberInput.css';

export default function PhoneNumberInput({
  id,
  label,
  value = '',
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  className = '',
  autoComplete = 'tel',
}) {
  const generatedId = useId();
  const inputId = id || `${generatedId}-phone`;
  const [selectedPrefix, setSelectedPrefix] = useState(() => splitPhoneNumber(value).prefix);

  const parsedValue = useMemo(
    () => splitPhoneNumber(value, selectedPrefix || DEFAULT_PHONE_PREFIX),
    [selectedPrefix, value],
  );

  const activePrefix = digitsOnly(value) ? parsedValue.prefix : selectedPrefix;
  const activeOption = getPhoneCodeOption(activePrefix);
  const localInputValue = formatLocalPhoneDigits(parsedValue.localDigits, activePrefix);

  useEffect(() => {
    if (digitsOnly(value)) {
      setSelectedPrefix(parsedValue.prefix);
    }
  }, [parsedValue.prefix, value]);

  const emitChange = (nextPrefix, nextLocalDigits) => {
    const nextValue = buildPhoneNumber(nextPrefix, nextLocalDigits);
    onChange?.(nextValue);
  };

  const handlePrefixChange = (event) => {
    const nextPrefix = event.target.value;
    setSelectedPrefix(nextPrefix);
    emitChange(nextPrefix, parsedValue.localDigits);
  };

  const handleLocalChange = (event) => {
    const rawValue = event.target.value;
    const nextDigits = digitsOnly(rawValue);

    if (!nextDigits) {
      onChange?.('');
      return;
    }

    const activePrefixDigits = digitsOnly(activePrefix);
    const looksLikeFullPhone =
      rawValue.includes('+') ||
      (activePrefixDigits &&
        nextDigits.startsWith(activePrefixDigits) &&
        nextDigits.length > activePrefixDigits.length + 5);

    if (looksLikeFullPhone) {
      const parsedFullPhone = splitPhoneNumber(rawValue, activePrefix);
      setSelectedPrefix(parsedFullPhone.prefix);
      emitChange(parsedFullPhone.prefix, parsedFullPhone.localDigits);
      return;
    }

    emitChange(activePrefix, nextDigits);
  };

  return (
    <div className={`phone-number-field ${error ? 'phone-number-field-invalid' : ''} ${className}`.trim()}>
      {label && (
        <label className="phone-number-label" htmlFor={inputId}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      <div className="phone-number-control">
        <select
          aria-label="Código de zona"
          value={activePrefix}
          onChange={handlePrefixChange}
          onBlur={onBlur}
          disabled={disabled}
        >
          {PHONE_CODE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} ({option.value})
            </option>
          ))}
        </select>
        <input
          id={inputId}
          type="tel"
          inputMode="numeric"
          autoComplete={autoComplete}
          placeholder={activeOption?.placeholder || 'número'}
          value={localInputValue}
          onChange={handleLocalChange}
          onBlur={onBlur}
          disabled={disabled}
          aria-invalid={Boolean(error)}
        />
      </div>
      {error && <span className="phone-number-error">{error}</span>}
    </div>
  );
}
