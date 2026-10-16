import type { AppLocale } from './locale';

/** Returns the value when it is a finite number, otherwise `null` (rendered as "Not available"). */
export function toFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export interface NumberFormatOptions {
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

/** Locale-aware number formatting; `null` when the value is missing or not a finite number. */
export function formatNumber(
  value: unknown,
  locale: AppLocale,
  { maximumFractionDigits = 2, minimumFractionDigits = 0 }: NumberFormatOptions = {},
): string | null {
  const number = toFiniteNumber(value);
  if (number === null) return null;

  return new Intl.NumberFormat(locale, { maximumFractionDigits, minimumFractionDigits }).format(number);
}
