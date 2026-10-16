import { Badge } from '../Badge/Badge';
import styles from './SectionHeader.module.scss';

interface SectionHeaderProps {
  /** Id of the heading, used by `aria-labelledby` on the section and as an anchor. */
  id: string;
  title: string;
  description?: string;
  /** Counter badge, e.g. "08 planets". */
  count?: string;
}

export function SectionHeader({ id, title, description, count }: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.text}>
        <h2 id={id} className={styles.title}>
          {title}
        </h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {count && <Badge>{count}</Badge>}
    </div>
  );
}
