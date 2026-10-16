import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import styles from './Breadcrumb.module.scss';

export interface BreadcrumbItem {
  label: string;
  /** Omitted for the current page (last item). */
  href?: string;
}

interface BreadcrumbProps {
  items: readonly BreadcrumbItem[];
}

/** "All planets / Solar System / Mars" (spec `detail-navigation`). */
export function Breadcrumb({ items }: BreadcrumbProps) {
  const t = useTranslations('ui');

  return (
    <nav aria-label={t('breadcrumb')} className={styles.breadcrumb}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className={styles.item}>
              {item.href && !isCurrent ? (
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isCurrent ? 'page' : undefined} className={styles.current}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
