import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import en from '../../messages/en.json';
import es from '../../messages/es.json';
import type { AppLocale } from '@/lib/format/locale';

const MESSAGES = { en, es } as const;

/** Renders UI inside the next-intl provider with the real message catalogs. */
export function renderWithIntl(ui: ReactNode, locale: AppLocale = 'en') {
  return render(
    <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]}>
      {ui}
    </NextIntlClientProvider>,
  );
}
