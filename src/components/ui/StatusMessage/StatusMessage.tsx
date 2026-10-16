import { useTranslations } from 'next-intl';
import styles from './StatusMessage.module.scss';

export type StatusVariant = 'empty' | 'error' | 'config-error';

const MESSAGE_KEY = {
  empty: 'empty',
  error: 'error',
  'config-error': 'configError',
} as const satisfies Record<StatusVariant, string>;

interface StatusMessageProps {
  variant: StatusVariant;
}

/** Empty, error and configuration-error states of a data area (spec `app-shell`). */
export function StatusMessage({ variant }: StatusMessageProps) {
  const t = useTranslations('ui.states');
  const isError = variant !== 'empty';

  return (
    <div role={isError ? 'alert' : 'status'} className={`${styles.message} ${isError ? styles.error : ''}`}>
      {t(MESSAGE_KEY[variant])}
    </div>
  );
}

interface CardGridSkeletonProps {
  count: number;
  className?: string;
}

/** Loading placeholder with the shape of a card grid. */
export function CardGridSkeleton({ count, className }: CardGridSkeletonProps) {
  const t = useTranslations('ui.states');

  return (
    <div role="status" aria-busy="true" className={className}>
      <span className={styles.visuallyHidden}>{t('loading')}</span>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={styles.skeletonCard} aria-hidden="true" />
      ))}
    </div>
  );
}
