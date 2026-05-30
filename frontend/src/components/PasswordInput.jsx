import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './PasswordInput.css';

const PasswordInput = forwardRef(function PasswordInput(
  {
    className = '',
    inputClassName = '',
    onBlur,
    ...props
  },
  ref
) {
  const [isVisible, setIsVisible] = useState(false);

  const hidePassword = () => {
    setIsVisible(false);
  };

  const handleClick = () => {
    setIsVisible((prev) => !prev);
  };

  const handlePointerDown = (event) => {
    event.preventDefault();
  };

  const handleBlur = (event) => {
    hidePassword();
    onBlur?.(event);
  };

  const toggleLabel = isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña';

  return (
    <div className={`password-input ${className}`.trim()}>
      <input
        ref={ref}
        type={isVisible ? 'text' : 'password'}
        className={inputClassName}
        {...props}
        onBlur={handleBlur}
      />
      <button
        type="button"
        className="password-input-toggle"
        aria-label={toggleLabel}
        aria-pressed={isVisible}
        title={toggleLabel}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onBlur={hidePassword}
      >
        {isVisible ? (
          <EyeOff size={18} strokeWidth={2} aria-hidden="true" />
        ) : (
          <Eye size={18} strokeWidth={2} aria-hidden="true" />
        )}
      </button>
    </div>
  );
});

export default PasswordInput;
