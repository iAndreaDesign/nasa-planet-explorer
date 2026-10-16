import { useTranslations } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { CelestialCard } from '@/components/ui/CelestialCard/CelestialCard';
import { safeLoad } from '@/lib/data/safeLoad';
import { formatNumber } from '@/lib/format/number';
import { getExoplanetImage } from '@/lib/images/celestialImages';
import { EXOPLANET_LIMIT, getExoplanets } from '@/services/exoplanets/exoplanets';
import { CardGrid, CardGridItem, CardGridLoading, formatCount, HomeSection, LoadStatus } from '../CardGrid/HomeSection';

export const EXOPLANETS_SECTION_ID = 'exoplanets';

/** Ten most recently discovered exoplanets (spec `exoplanets`). */
export async function ExoplanetsSection() {
  const [t, tCommon, tUi, locale] = await Promise.all([
    getTranslations('home.exoplanets'),
    getTranslations('common'),
    getTranslations('ui'),
    getLocale(),
  ]);
  const result = await safeLoad('exoplanets', getExoplanets);
  const exoplanets = result.status === 'ok' ? result.data : [];

  return (
    <HomeSection
      id={EXOPLANETS_SECTION_ID}
      title={t('title')}
      description={t('description')}
      count={exoplanets.length > 0 ? t('count', { count: formatCount(exoplanets.length) }) : undefined}
    >
      <LoadStatus result={result} />
      {exoplanets.length > 0 && (
        <CardGrid>
          {exoplanets.map((exoplanet, index) => {
            const distance = formatNumber(exoplanet.distance, locale);
            return (
              <CardGridItem key={exoplanet.slug}>
                <CelestialCard
                  href={`/exoplanets/${exoplanet.slug}`}
                  name={exoplanet.name}
                  image={getExoplanetImage(index)}
                  eyebrow={tUi('artistImpression')}
                  details={[distance === null ? tCommon('notAvailable') : t('distance', { distance })]}
                />
              </CardGridItem>
            );
          })}
        </CardGrid>
      )}
    </HomeSection>
  );
}

export function ExoplanetsSectionFallback() {
  const t = useTranslations('home.exoplanets');

  return (
    <HomeSection id={EXOPLANETS_SECTION_ID} title={t('title')} description={t('description')}>
      <CardGridLoading count={EXOPLANET_LIMIT} />
    </HomeSection>
  );
}
