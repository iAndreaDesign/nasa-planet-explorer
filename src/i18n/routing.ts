import { defineRouting } from 'next-intl/routing';
import { DEFAULT_LOCALE, LOCALES } from '@/lib/format/locale';

/** `/en/...` and `/es/...`; unprefixed URLs are redirected using `Accept-Language` (spec `localization`). */
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
});
