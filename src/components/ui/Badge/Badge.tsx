import type { ReactNode } from 'react';
import styles from './Badge.module.scss';

export type BadgeTone = 'neutral' | 'primary' | 'accent';

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
}

/** Small pill label ("08 planets", "Hot"). */
export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}
