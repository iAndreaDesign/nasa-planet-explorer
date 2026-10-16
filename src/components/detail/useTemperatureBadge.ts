import { useTranslations } from 'next-intl';
import type { BadgeTone } from '@/components/ui/Badge/Badge';
import { classifyTemperature } from '@/lib/format/temperature';

/** "Cold" (blue) below 270 K, "Hot" (red) above 323 K, otherwise no badge (decision D14). */
export function useTemperatureBadge(kelvin: number | null): { label: string; tone: BadgeTone } | null {
  const t = useTranslations('detail.temperatureBadge');
  const temperature = classifyTemperature(kelvin);
  if (temperature === null) return null;

  return { label: t(temperature), tone: temperature === 'cold' ? 'accent' : 'primary' };
}
