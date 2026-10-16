import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { CelestialCard } from '@/components/ui/CelestialCard/CelestialCard';
import { safeLoad } from '@/lib/data/safeLoad';
import { formatPosition } from '@/lib/format/position';
import { getPlanetImage } from '@/lib/images/celestialImages';
import { getPlanets } from '@/services/solarSystem/solarSystem';
import { CardGrid, CardGridItem, CardGridLoading, formatCount, HomeSection, LoadStatus } from '../CardGrid/HomeSection';

export const SOLAR_SYSTEM_SECTION_ID = 'solar-system';
const PLANET_COUNT = 8;

/** The eight planets ordered by distance from the Sun (spec `solar-system-planets`). */
export async function SolarSystemSection() {
  const [t, tCommon] = await Promise.all([getTranslations('home.solarSystem'), getTranslations('common')]);
  const result = await safeLoad('solar-system', getPlanets);
  const planets = result.status === 'ok' ? result.data : [];

  return (
    <HomeSection
      id={SOLAR_SYSTEM_SECTION_ID}
      title={t('title')}
      description={t('description')}
      count={planets.length > 0 ? t('count', { count: formatCount(planets.length) }) : undefined}
    >
      <LoadStatus result={result} />
      {planets.length > 0 && (
        <CardGrid>
          {planets.map((planet, index) => (
            <CardGridItem key={planet.id}>
              <CelestialCard
                href={`/planets/${planet.slug}`}
                name={planet.name}
                image={getPlanetImage(planet.slug, index)}
                details={[
                  t('position', {
                    position: formatPosition(planet.position),
                    type: planet.bodyType ?? tCommon('notAvailable'),
                  }),
                  t('moons', { count: planet.moons.length }),
                ]}
              />
            </CardGridItem>
          ))}
        </CardGrid>
      )}
    </HomeSection>
  );
}

export function SolarSystemSectionFallback() {
  const t = useTranslations('home.solarSystem');

  return (
    <HomeSection id={SOLAR_SYSTEM_SECTION_ID} title={t('title')} description={t('description')}>
      <CardGridLoading count={PLANET_COUNT} />
    </HomeSection>
  );
}
