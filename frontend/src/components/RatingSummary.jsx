import { Star } from 'lucide-react';

export default function RatingSummary({
  title = 'Calificacion',
  average = 0,
  total = 0,
  emptyText = 'Todavia sin calificaciones',
}) {
  const safeAverage = Number.isFinite(Number(average)) ? Number(average) : 0;
  const safeTotal = Number.isFinite(Number(total)) ? Number(total) : 0;
  const roundedAverage = Math.round(safeAverage);

  return (
    <div
      style={{
        padding: '0.7rem 0.85rem',
        border: '1px solid #e6d9c5',
        borderRadius: '0.6rem',
        background: '#fffaf2',
        width: 'min(100%, 280px)',
        maxWidth: '100%',
      }}
    >
      <p style={{ margin: 0, marginBottom: '0.35rem', color: '#5e4d38', fontWeight: 600 }}>{title}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginBottom: '0.35rem' }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= roundedAverage;
          return (
            <Star
              key={star}
              size={16}
              style={{ color: active ? '#d97706' : '#d2d2d2' }}
              fill={active ? 'currentColor' : 'none'}
            />
          );
        })}
      </div>
      {safeTotal > 0 ? (
        <p style={{ margin: 0, color: '#6f604b', fontSize: '0.9rem' }}>
          <strong>{safeAverage.toFixed(1)}/5</strong> · {safeTotal} calificacion{safeTotal === 1 ? '' : 'es'}
        </p>
      ) : (
        <p style={{ margin: 0, color: '#7e705c', fontSize: '0.9rem' }}>{emptyText}</p>
      )}
    </div>
  );
}
