import { StatCard, StatGrid } from '@/components/ui/StatCard/StatCard';
import styles from './PropertyGroup.module.scss';

export interface PropertyItem {
  key: string;
  label: string;
  /** Formatted value, or `null` for "Not available". */
  value: string | null;
  unit?: string;
}

interface PropertyGroupProps {
  id: string;
  title: string;
  items: readonly PropertyItem[];
}

/** Titled grid of properties (the heading names the description list). */
export function PropertyGroup({ id, title, items }: PropertyGroupProps) {
  const headingId = `${id}-title`;

  return (
    <section aria-labelledby={headingId} className={styles.group}>
      <h2 id={headingId} className={styles.title}>
        {title}
      </h2>
      <StatGrid>
        {items.map((item) => (
          <StatCard key={item.key} label={item.label} value={item.value} unit={item.unit} />
        ))}
      </StatGrid>
    </section>
  );
}
