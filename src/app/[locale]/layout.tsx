import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer/Footer';
import { Header } from '@/components/layout/Header/Header';
import { MAIN_CONTENT_ID, SkipLink } from '@/components/layout/SkipLink/SkipLink';
import { routing } from '@/i18n/routing';
import '@/styles/globals.scss';
import styles from './layout.module.scss';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<LocaleLayoutProps, 'children'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: 'metadata' });
  return { title: t('title'), description: t('description') };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <html lang={locale} className={inter.variable}>
      {/* Browser extensions often inject attributes into <body>; ignore those hydration mismatches. */}
      <body suppressHydrationWarning>
        <NextIntlClientProvider>
          <SkipLink />
          <Header />
          <main id={MAIN_CONTENT_ID} tabIndex={-1} className={styles.main}>
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
