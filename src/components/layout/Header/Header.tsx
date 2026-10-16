import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import { Logo } from '../Logo/Logo';
import styles from './Header.module.scss';

/** Site header: logo + title linking home, and the language switcher (spec `app-shell`). */
export function Header() {
  const t = useTranslations('header');

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <Logo className={styles.logo} />
          <span>{t('title')}</span>
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
