import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import styles from './page.module.scss';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className={styles.page}>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <Link href="/">{t('backHome')}</Link>
    </div>
  );
}
