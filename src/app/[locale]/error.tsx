'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import buttonStyles from '@/components/ui/ButtonLink/ButtonLink.module.scss';
import styles from './page.module.scss';

interface ErrorPageProps {
  error: unknown;
  retry: () => void;
}

/** Unexpected rendering errors. Expected API failures are shown inline by each area (`safeLoad`). */
export default function ErrorPage({ error, retry }: ErrorPageProps) {
  const t = useTranslations('error');

  useEffect(() => {
    console.error(error instanceof Error ? error.name : 'Unknown error');
  }, [error]);

  return (
    <div className={styles.page} role="alert">
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <button type="button" className={`${buttonStyles.button} ${buttonStyles.primary}`} onClick={() => retry()}>
        {t('retry')}
      </button>
    </div>
  );
}
