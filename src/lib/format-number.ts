const STX_DECIMALS = 6;

export function formatStx(microStx: number): string {
  return (microStx / 10 ** STX_DECIMALS).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value);
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export type {};
