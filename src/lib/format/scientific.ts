import type { AppLocale } from './locale';
import { formatNumber, toFiniteNumber } from './number';

const SUPERSCRIPTS: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '-': '⁻',
};

export function toSuperscript(value: number): string {
  return Array.from(String(value), (char) => SUPERSCRIPTS[char] ?? char).join('');
}

const FRACTION_DIGITS = 2;

/** Rewrites mantissa × 10^exponent so that 1 ≤ |mantissa| < 10 after rounding. */
function normalize(mantissa: number, exponent: number): { mantissa: number; exponent: number } {
  if (mantissa === 0) return { mantissa: 0, exponent: 0 };

  const shift = Math.floor(Math.log10(Math.abs(mantissa)));
  let normalized = mantissa / 10 ** shift;
  let normalizedExponent = exponent + shift;

  const factor = 10 ** FRACTION_DIGITS;
  if (Math.abs(Math.round(normalized * factor) / factor) >= 10) {
    normalized /= 10;
    normalizedExponent += 1;
  }

  return { mantissa: normalized, exponent: normalizedExponent };
}

/**
 * Formats `mantissa × 10^exponent` (e.g. API `massValue` / `massExponent`) as "6.42 × 10²³".
 * Returns `null` when either part is missing or not a finite integer exponent.
 */
export function formatScientific(mantissa: unknown, exponent: unknown, locale: AppLocale): string | null {
  const value = toFiniteNumber(mantissa);
  const power = toFiniteNumber(exponent);
  if (value === null || power === null || !Number.isInteger(power)) return null;

  const normalized = normalize(value, power);
  const formattedMantissa = formatNumber(normalized.mantissa, locale, { maximumFractionDigits: FRACTION_DIGITS });
  if (formattedMantissa === null) return null;
  if (normalized.exponent === 0) return formattedMantissa;

  return `${formattedMantissa} × 10${toSuperscript(normalized.exponent)}`;
}
