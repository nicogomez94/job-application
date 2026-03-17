export const formatDate = (date) => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatCurrency = (amount, currency = 'ARS') => {
  const safeAmount = Number(amount || 0);
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(safeAmount);
};

export const statusToBadgeClass = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'badge badge-success';
    case 'EXPIRED':
      return 'badge badge-warning';
    case 'CANCELLED':
      return 'badge badge-error';
    case 'PENDING':
      return 'badge badge-info';
    default:
      return 'badge badge-info';
  }
};
