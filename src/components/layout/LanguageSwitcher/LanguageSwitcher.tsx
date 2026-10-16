'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import styles from './LanguageSwitcher.module.scss';

/** Switches language while keeping the current page (spec `localization`). */
export function LanguageSwitcher() {
  const t = useTranslations('language');
  const currentLocale = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t('label')}>
      <ul className={styles.list}>
        {routing.locales.map((locale) => (
          <li key={locale}>
            <Link
              className={styles.link}
              href={pathname}
              locale={locale}
              hrefLang={locale}
              lang={locale}
              aria-label={t(`names.${locale}`)}
              aria-current={locale === currentLocale ? 'true' : undefined}
            >
              {t(`short.${locale}`)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
