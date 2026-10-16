import { useTranslations } from 'next-intl';
import styles from './SkipLink.module.scss';

export const MAIN_CONTENT_ID = 'main-content';

/** First focusable element: jumps over the header to the main content. */
export function SkipLink() {
  const t = useTranslations('layout');

  return (
    <a href={`#${MAIN_CONTENT_ID}`} className={styles.skipLink}>
      {t('skipToContent')}
    </a>
  );
}
