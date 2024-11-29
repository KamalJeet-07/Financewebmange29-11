export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
};

export const calculateTrendPercentage = (current: number, total: number): string => {
  if (total === 0) return '0%';
  return `${((current / total) * 100).toFixed(1)}%`;
};

export const getTrendDirection = (value: number): 'up' | 'down' | 'neutral' => {
  if (value > 0) return 'up';
  if (value < 0) return 'down';
  return 'neutral';
};