import type { ReactNode } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';
import { CardGridSkeleton, StatusMessage } from '@/components/ui/StatusMessage/StatusMessage';
import type { LoadResult } from '@/lib/data/safeLoad';
import styles from './HomeSection.module.scss';

interface HomeSectionProps {
  /** Section id, also the in-page anchor (e.g. "solar-system"). */
  id: string;
  title: string;
  description: string;
  count?: string;
  children: ReactNode;
}

/** Home page section with its header (spec `app-shell`). */
export function HomeSection({ id, title, description, count, children }: HomeSectionProps) {
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className={styles.section}>
      <SectionHeader id={headingId} title={title} description={description} count={count} />
      {children}
    </section>
  );
}

/** Responsive card grid: two columns on mobile, four on desktop. */
export function CardGrid({ children }: { children: ReactNode }) {
  return <ul className={styles.grid}>{children}</ul>;
}

export function CardGridItem({ children }: { children: ReactNode }) {
  return <li className={styles.item}>{children}</li>;
}

export function CardGridLoading({ count }: { count: number }) {
  return <CardGridSkeleton count={count} className={styles.grid} />;
}

/** Renders the empty/error state of a failed or empty load, or `null` when there is data to show. */
export function LoadStatus<T extends readonly unknown[]>({ result }: { result: LoadResult<T> }) {
  if (result.status === 'config-error') return <StatusMessage variant="config-error" />;
  if (result.status === 'error') return <StatusMessage variant="error" />;
  if (result.data.length === 0) return <StatusMessage variant="empty" />;
  return null;
}

/** Two-digit counter for section badges ("08", "10"). */
export function formatCount(count: number): string {
  return String(count).padStart(2, '0');
}
