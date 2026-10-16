/**
 * Replacement for `next-intl/server` in component tests (async Server Components).
 * Usage: `vi.mock('next-intl/server', () => import('@/test/intlServerMock'));`
 * The locale is taken from `setTestLocale` (default "en").
 */
import { createTranslator } from 'next-intl';
import en from '../../messages/en.json';
import es from '../../messages/es.json';
import type { AppLocale } from '@/lib/format/locale';

const MESSAGES = { en, es } as const;
let currentLocale: AppLocale = 'en';

export function setTestLocale(locale: AppLocale) {
  currentLocale = locale;
}

export async function getLocale(): Promise<AppLocale> {
  return currentLocale;
}

export async function getTranslations(namespace?: string) {
  // The namespace is a runtime string here; the typed overloads are exercised by the real components.
  return createTranslator({
    locale: currentLocale,
    messages: MESSAGES[currentLocale],
    namespace: namespace as never,
  });
}

export function setRequestLocale() {}
