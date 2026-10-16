import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import styles from './StatCard.module.scss';

interface StatGridProps {
  children: ReactNode;
}

/** Description list of properties; each child is a `StatCard`. Precede it with a visible heading. */
export function StatGrid({ children }: StatGridProps) {
  return (
    <dl className={styles.grid}>
      {children}
    </dl>
  );
}

interface StatCardProps {
  label: string;
  /** Already formatted value; `null` renders the translated "Not available". */
  value: string | null;
  unit?: string;
  icon?: ReactNode;
}

export function StatCard({ label, value, unit, icon }: StatCardProps) {
  const t = useTranslations('common');

  return (
    <div className={styles.card}>
      <dt className={styles.label}>
        <span>{label}</span>
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
      </dt>
      <dd className={styles.value}>
        {value === null ? (
          <span className={styles.notAvailable}>{t('notAvailable')}</span>
        ) : (
          <>
            <span className={styles.number}>{value}</span>
            {unit && <span className={styles.unit}>{unit}</span>}
          </>
        )}
      </dd>
    </div>
  );
}
