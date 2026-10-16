import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { DetailLayout } from '@/components/detail/DetailLayout';
import { PlanetDetail } from '@/components/planet/PlanetDetail';
import { StatusMessage } from '@/components/ui/StatusMessage/StatusMessage';
import { routing } from '@/i18n/routing';
import { safeLoad } from '@/lib/data/safeLoad';
import { getAdjacent } from '@/lib/navigation/adjacent';
import { getPlanets } from '@/services/solarSystem/solarSystem';

export const revalidate = 3600;

interface PlanetPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

/** One page per planet and locale at build time; unknown slugs render on demand and 404. */
export async function generateStaticParams() {
  const result = await safeLoad('planet-params', getPlanets);
  return result.status === 'ok' ? result.data.map((planet) => ({ slug: planet.slug })) : [];
}

export async function generateMetadata({ params }: PlanetPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const result = await safeLoad('planet-metadata', getPlanets);
  const planet = result.status === 'ok' ? result.data.find((candidate) => candidate.slug === slug) : undefined;
  if (!planet) return {};

  const t = await getTranslations({ locale, namespace: 'planet' });
  return { title: t('metaTitle', { name: planet.name }) };
}

export default async function PlanetPage({ params }: PlanetPageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const result = await safeLoad('planet-detail', getPlanets);
  if (result.status !== 'ok') {
    const t = await getTranslations('detail');
    return (
      <DetailLayout breadcrumb={[{ label: t('allPlanets'), href: '/' }, { label: slug }]}>
        <StatusMessage variant={result.status} />
      </DetailLayout>
    );
  }

  const index = result.data.findIndex((planet) => planet.slug === slug);
  const planet = result.data[index];
  const adjacent = getAdjacent(result.data, index);
  if (!planet || !adjacent) notFound();

  return <PlanetDetail planet={planet} adjacent={adjacent} />;
}
