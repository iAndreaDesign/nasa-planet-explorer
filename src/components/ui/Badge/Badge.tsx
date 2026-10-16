import type { ReactNode } from 'react';
import styles from './Badge.module.scss';

interface BadgeProps {
  children: ReactNode;
  tone?: 'neutral' | 'primary';
}

/** Small pill label ("08 planets", "Planet"). */
export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}
