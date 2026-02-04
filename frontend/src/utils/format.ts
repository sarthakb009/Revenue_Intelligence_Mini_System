const CURRENCY_OPTIONS: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
};

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", CURRENCY_OPTIONS).format(value);
}
