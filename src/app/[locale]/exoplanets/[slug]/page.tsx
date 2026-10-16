import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { DetailLayout } from '@/components/detail/DetailLayout';
import { ExoplanetDetail } from '@/components/exoplanet/ExoplanetDetail';
import { StatusMessage } from '@/components/ui/StatusMessage/StatusMessage';
import { routing } from '@/i18n/routing';
import { safeLoad } from '@/lib/data/safeLoad';
import { getAdjacent } from '@/lib/navigation/adjacent';
import { getExoplanets } from '@/services/exoplanets/exoplanets';

export const revalidate = 3600;

interface ExoplanetPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

/** One page per exoplanet of the current selection and locale; other slugs render on demand and 404. */
export async function generateStaticParams() {
  const result = await safeLoad('exoplanet-params', getExoplanets);
  return result.status === 'ok' ? result.data.map((exoplanet) => ({ slug: exoplanet.slug })) : [];
}

export async function generateMetadata({ params }: ExoplanetPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const result = await safeLoad('exoplanet-metadata', getExoplanets);
  const exoplanet = result.status === 'ok' ? result.data.find((candidate) => candidate.slug === slug) : undefined;
  if (!exoplanet) return {};

  const t = await getTranslations({ locale, namespace: 'exoplanet' });
  return { title: t('metaTitle', { name: exoplanet.name }) };
}

export default async function ExoplanetPage({ params }: ExoplanetPageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const result = await safeLoad('exoplanet-detail', getExoplanets);
  if (result.status !== 'ok') {
    const t = await getTranslations('detail');
    return (
      <DetailLayout breadcrumb={[{ label: t('allPlanets'), href: '/' }, { label: slug }]}>
        <StatusMessage variant={result.status} />
      </DetailLayout>
    );
  }

  const index = result.data.findIndex((exoplanet) => exoplanet.slug === slug);
  const exoplanet = result.data[index];
  const adjacent = getAdjacent(result.data, index);
  if (!exoplanet || !adjacent) notFound();

  return <ExoplanetDetail exoplanet={exoplanet} index={index} adjacent={adjacent} />;
}
