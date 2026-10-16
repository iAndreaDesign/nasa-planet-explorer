import { notFound } from 'next/navigation';
import { hasLocale, useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { routing } from '@/i18n/routing';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

/** Placeholder until the home sections are built (T10). */
export default function HomePage({ params }: HomePageProps) {
  const { locale } = use(params);
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = useTranslations('home');

  return (
    <main>
      <h1>{t('title')}</h1>
    </main>
  );
}
