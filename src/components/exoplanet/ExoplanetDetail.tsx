import { useLocale, useTranslations } from 'next-intl';
import { DetailHero } from '@/components/detail/DetailHero';
import { DetailLayout } from '@/components/detail/DetailLayout';
import { PropertyGroup, type PropertyItem } from '@/components/detail/PropertyGroup';
import { useTemperatureBadge } from '@/components/detail/useTemperatureBadge';
import { formatNumber } from '@/lib/format/number';
import { formatPosition } from '@/lib/format/position';
import { getExoplanetImage } from '@/lib/images/celestialImages';
import type { Adjacent } from '@/lib/navigation/adjacent';
import type { Exoplanet } from '@/services/exoplanets/types';
import { EXOPLANETS_SECTION_ID } from '../home/ExoplanetsSection/ExoplanetsSection';

interface ExoplanetDetailProps {
  exoplanet: Exoplanet;
  /** 0-based index in the selection (position and image, as on the home card). */
  index: number;
  adjacent: Adjacent<Exoplanet>;
}

type PropertyKey =
  | 'hostName'
  | 'discoveryYear'
  | 'discoveryMethod'
  | 'distance'
  | 'radius'
  | 'mass'
  | 'density';

/**
 * Exoplanet detail showing every queried field in API units (spec `exoplanets`).
 * Order: hero (orbital period and equilibrium temperature), discovery, physical properties. Each field appears once.
 */
export function ExoplanetDetail({ exoplanet, index, adjacent }: ExoplanetDetailProps) {
  const t = useTranslations('exoplanet');
  const tDetail = useTranslations('detail');
  const tCommon = useTranslations('common');
  const tUi = useTranslations('ui');
  const locale = useLocale();
  const badge = useTemperatureBadge(exoplanet.equilibriumTemperature);

  const number = (value: number | null, maximumFractionDigits = 2) => formatNumber(value, locale, { maximumFractionDigits });
  const withUnit = (value: string | null, unit: string) => (value === null ? tCommon('notAvailable') : `${value} ${unit}`);
  const item = (key: PropertyKey, value: string | null, unit?: string): PropertyItem => ({
    key,
    label: t(`properties.${key}`),
    value,
    unit,
  });

  const days = tDetail('units.days');
  const orbitalPeriod = number(exoplanet.orbitalPeriod);

  return (
    <DetailLayout
      breadcrumb={[
        { label: tDetail('allPlanets'), href: '/' },
        { label: t('breadcrumbSection'), href: `/#${EXOPLANETS_SECTION_ID}` },
        { label: exoplanet.name },
      ]}
    >
      <DetailHero
        eyebrow={t('eyebrow', { position: formatPosition(index + 1) })}
        name={exoplanet.name}
        badge={badge}
        image={getExoplanetImage(index)}
        imageNote={tUi('artistImpression')}
        summary={[
          { label: t('orbitalPeriod'), value: withUnit(orbitalPeriod, days) },
          { label: t('properties.equilibriumTemperature'), value: withUnit(number(exoplanet.equilibriumTemperature), 'K') },
        ]}
        previous={{ href: `/exoplanets/${adjacent.previous.slug}`, label: t('previous', { name: adjacent.previous.name }) }}
        next={{ href: `/exoplanets/${adjacent.next.slug}`, label: t('next', { name: adjacent.next.name }) }}
      />
      <PropertyGroup
        id="discovery"
        title={t('sections.discovery')}
        items={[
          item('hostName', exoplanet.hostName),
          // A year is not a quantity: no thousands separator.
          item('discoveryYear', exoplanet.discoveryYear === null ? null : String(exoplanet.discoveryYear)),
          item('discoveryMethod', exoplanet.discoveryMethod),
          item('distance', number(exoplanet.distance), t('units.parsecs')),
        ]}
      />
      <PropertyGroup
        id="physical"
        title={t('sections.physical')}
        items={[
          item('radius', number(exoplanet.radius), t('units.earthRadii')),
          item('mass', number(exoplanet.mass), t('units.earthMasses')),
          item('density', number(exoplanet.density, 3), 'g/cm³'),
        ]}
      />
    </DetailLayout>
  );
}
