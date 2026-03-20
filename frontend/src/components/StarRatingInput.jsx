import { Star } from 'lucide-react';

export default function StarRatingInput({
  value = null,
  onChange,
  disabled = false,
  size = 18,
}) {
  const selectedValue = Number.isInteger(value) ? value : 0;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
      {[1, 2, 3, 4, 5].map((starValue) => {
        const active = starValue <= selectedValue;
        return (
          <button
            key={starValue}
            type="button"
            onClick={() => onChange?.(starValue)}
            disabled={disabled}
            aria-label={`Puntuar con ${starValue} estrella${starValue > 1 ? 's' : ''}`}
            title={`${starValue} estrella${starValue > 1 ? 's' : ''}`}
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: disabled ? 'not-allowed' : 'pointer',
              color: active ? '#d97706' : '#c7c7c7',
              opacity: disabled ? 0.7 : 1,
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <Star size={size} fill={active ? 'currentColor' : 'none'} />
          </button>
        );
      })}
      <span style={{ marginLeft: '0.35rem', color: '#7e705c', fontSize: '0.88rem' }}>
        {selectedValue > 0 ? `${selectedValue}/5` : 'Sin puntuar'}
      </span>
    </div>
  );
}
