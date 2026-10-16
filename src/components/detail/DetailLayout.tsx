import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/Breadcrumb/Breadcrumb';
import { ButtonLink } from '@/components/ui/ButtonLink/ButtonLink';
import styles from './DetailLayout.module.scss';

interface DetailLayoutProps {
  breadcrumb: readonly BreadcrumbItem[];
  children: ReactNode;
}

/** Shared frame of detail pages: breadcrumb, content and "Back to all planets" (spec `detail-navigation`). */
export function DetailLayout({ breadcrumb, children }: DetailLayoutProps) {
  const t = useTranslations('detail');

  return (
    <div className={styles.page}>
      <Breadcrumb items={breadcrumb} />
      <div className={styles.content}>{children}</div>
      <div className={styles.footer}>
        <ButtonLink href="/" kind="route">
          {t('back')}
        </ButtonLink>
      </div>
    </div>
  );
}
