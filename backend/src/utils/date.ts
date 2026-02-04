/**
 * Shared date parsing and quarter logic.
 */

export function parseDate(s: string | null): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (24 * 60 * 60 * 1000));
}

export function daysAgo(date: Date): number {
  return Math.round((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000));
}

const QUARTER_MONTHS: Record<string, string[]> = {
  "2025-Q1": ["2025-01", "2025-02", "2025-03"],
  "2025-Q2": ["2025-04", "2025-05", "2025-06"],
  "2025-Q3": ["2025-07", "2025-08", "2025-09"],
  "2025-Q4": ["2025-10", "2025-11", "2025-12"],
};

export function monthInQuarter(month: string, quarter: string): boolean {
  return QUARTER_MONTHS[quarter]?.includes(month) ?? false;
}

export function quarterFromMonth(month: string): string {
  const [y, m] = month.split("-").map(Number);
  const q = Math.ceil(m / 3);
  return `${y}-Q${q}`;
}

/** Format YYYY-MM from a Date. */
export function monthString(d: Date): string {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
}
