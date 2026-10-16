import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import { ExoplanetsSection, ExoplanetsSectionFallback } from '@/components/home/ExoplanetsSection/ExoplanetsSection';
import { Hero, HeroFallback } from '@/components/home/Hero/Hero';
import { SolarSystemSection, SolarSystemSectionFallback } from '@/components/home/SolarSystemSection/SolarSystemSection';
import { routing } from '@/i18n/routing';

/** Re-render at least hourly, also when a section failed (e.g. missing credentials) at build time. */
export const revalidate = 3600;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

/** Each section loads and fails independently (spec `app-shell`). */
export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <Suspense fallback={<HeroFallback />}>
        <Hero />
      </Suspense>
      <Suspense fallback={<SolarSystemSectionFallback />}>
        <SolarSystemSection />
      </Suspense>
      <Suspense fallback={<ExoplanetsSectionFallback />}>
        <ExoplanetsSection />
      </Suspense>
    </>
  );
}
