import { useLocale, useTranslations } from 'next-intl';
import { DetailHero } from '@/components/detail/DetailHero';
import { DetailLayout } from '@/components/detail/DetailLayout';
import { PropertyGroup, type PropertyItem } from '@/components/detail/PropertyGroup';
import { formatNumber } from '@/lib/format/number';
import { formatPosition } from '@/lib/format/position';
import { formatScientific } from '@/lib/format/scientific';
import { classifyTemperature } from '@/lib/format/temperature';
import { getPlanetImage } from '@/lib/images/celestialImages';
import type { Adjacent } from '@/lib/navigation/adjacent';
import type { Planet } from '@/services/solarSystem/types';
import { SOLAR_SYSTEM_SECTION_ID } from '../home/SolarSystemSection/SolarSystemSection';

interface PlanetDetailProps {
  planet: Planet;
  adjacent: Adjacent<Planet>;
}

type PropertyKey =
  | 'mass'
  | 'meanRadius'
  | 'density'
  | 'gravity'
  | 'escape'
  | 'axialTilt'
  | 'semimajorAxis'
  | 'sideralOrbit'
  | 'sideralRotation'
  | 'avgTemp';

/** Planet detail with the properties required by spec `solar-system-planets`, in API units. */
export function PlanetDetail({ planet, adjacent }: PlanetDetailProps) {
  const t = useTranslations('planet');
  const tDetail = useTranslations('detail');
  const locale = useLocale();
  const tCommon = useTranslations('common');

  const number = (value: number | null, maximumFractionDigits = 2) => formatNumber(value, locale, { maximumFractionDigits });
  const item = (key: PropertyKey, value: string | null, unit?: string): PropertyItem => ({
    key,
    label: t(`properties.${key}`),
    value,
    unit,
  });

  const days = tDetail('units.days');
  const temperature = classifyTemperature(planet.avgTemp);
  const orbitalPeriod = number(planet.sideralOrbit);

  return (
    <DetailLayout
      breadcrumb={[
        { label: tDetail('allPlanets'), href: '/' },
        { label: t('breadcrumbSection'), href: `/#${SOLAR_SYSTEM_SECTION_ID}` },
        { label: planet.name },
      ]}
    >
      <DetailHero
        eyebrow={t('eyebrow', { position: formatPosition(planet.position) })}
        name={planet.name}
        badge={
          temperature && {
            label: t(`temperatureBadge.${temperature}`),
            tone: temperature === 'cold' ? 'accent' : 'primary',
          }
        }
        image={getPlanetImage(planet.slug, planet.position - 1)}
        summary={[
          { label: t('orbitalPeriod'), value: orbitalPeriod === null ? tCommon('notAvailable') : `${orbitalPeriod} ${days}` },
          { label: t('knownMoons'), value: t('moonsCount', { count: planet.moons.length }) },
        ]}
        previous={{ href: `/planets/${adjacent.previous.slug}`, label: t('previous', { name: adjacent.previous.name }) }}
        next={{ href: `/planets/${adjacent.next.slug}`, label: t('next', { name: adjacent.next.name }) }}
      />
      <PropertyGroup
        id="physical"
        title={t('sections.physical')}
        items={[
          item('mass', planet.mass && formatScientific(planet.mass.value, planet.mass.exponent, locale), 'kg'),
          item('meanRadius', number(planet.meanRadius, 1), 'km'),
          item('density', number(planet.density, 3), 'g/cm³'),
          item('gravity', number(planet.gravity), 'm/s²'),
          item('escape', number(planet.escape, 0), 'm/s'),
          item('axialTilt', number(planet.axialTilt), '°'),
        ]}
      />
      <PropertyGroup
        id="orbit"
        title={t('sections.orbit')}
        items={[
          item('semimajorAxis', number(planet.semimajorAxis, 0), 'km'),
          item('sideralOrbit', orbitalPeriod, days),
          item('sideralRotation', number(planet.sideralRotation), tDetail('units.hours')),
        ]}
      />
      <PropertyGroup
        id="temperature"
        title={t('sections.temperature')}
        items={[item('avgTemp', number(planet.avgTemp), 'K')]}
      />
    </DetailLayout>
  );
}
