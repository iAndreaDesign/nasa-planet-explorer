import { useTranslations } from 'next-intl';
import styles from './Footer.module.scss';

/** Site footer with the application name and data credits (spec `app-shell`). */
export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.title}>{t('title')}</p>
        <p className={styles.credits}>{t('credits')}</p>
      </div>
    </footer>
  );
}
