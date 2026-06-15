// src/utils/formatters.ts
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatVolume = (volume: number): string => {
  return `${volume.toFixed(2)} л`;
};

export const formatDateTime = (isoString: string): string => {
  if (!isoString || isoString.startsWith('0001')) return '—';
  return new Date(isoString).toLocaleString('ru-RU');
};

export const formatProgress = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.min((current / total) * 100, 100);
};
