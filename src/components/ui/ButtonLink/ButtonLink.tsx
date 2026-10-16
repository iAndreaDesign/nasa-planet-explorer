import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowUpRightIcon } from '../icons/ArrowUpRightIcon';
import styles from './ButtonLink.module.scss';

interface ButtonLinkProps {
  href: string;
  children: string;
  variant?: 'primary' | 'secondary';
  /** `anchor`: in-page anchor or plain URL; `external`: new tab, announced; `route`: app route in the current locale. */
  kind?: 'anchor' | 'external' | 'route';
  className?: string;
}

/** Link styled as a button. */
export function ButtonLink({ href, children, variant = 'primary', kind = 'anchor', className = '' }: ButtonLinkProps) {
  const t = useTranslations('ui');
  const classes = `${styles.button} ${styles[variant]} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      <ArrowUpRightIcon className={styles.icon} />
    </>
  );

  if (kind === 'route') {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  const externalProps =
    kind === 'external'
      ? { target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${children} ${t('opensInNewTab')}` }
      : {};

  return (
    <a href={href} className={classes} {...externalProps}>
      {content}
    </a>
  );
}
