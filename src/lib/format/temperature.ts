import { toFiniteNumber } from './number';

/** Below this average temperature a planet is labelled "cold" (K). */
export const COLD_BELOW_KELVIN = 270;
/** Above this average temperature a planet is labelled "hot" (K). */
export const HOT_ABOVE_KELVIN = 323;

export type TemperatureClass = 'cold' | 'hot';

/** "cold" below 270 K, "hot" above 323 K, otherwise (or without data) `null` (user requirement, T11). */
export function classifyTemperature(kelvin: unknown): TemperatureClass | null {
  const value = toFiniteNumber(kelvin);
  if (value === null) return null;
  if (value < COLD_BELOW_KELVIN) return 'cold';
  if (value > HOT_ABOVE_KELVIN) return 'hot';
  return null;
}
