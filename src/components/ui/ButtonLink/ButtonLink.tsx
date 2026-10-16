import { useTranslations } from 'next-intl';
import { ArrowUpRightIcon } from '../icons/ArrowUpRightIcon';
import styles from './ButtonLink.module.scss';

interface ButtonLinkProps {
  href: string;
  children: string;
  variant?: 'primary' | 'secondary';
  /** Opens in a new tab and announces it to screen readers. */
  external?: boolean;
  className?: string;
}

/** Link styled as a button. Use for in-page anchors and external URLs (not for locale routes). */
export function ButtonLink({ href, children, variant = 'primary', external = false, className = '' }: ButtonLinkProps) {
  const t = useTranslations('ui');
  const externalProps = external
    ? { target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${children} ${t('opensInNewTab')}` }
    : {};

  return (
    <a href={href} className={`${styles.button} ${styles[variant]} ${className}`} {...externalProps}>
      <span>{children}</span>
      <ArrowUpRightIcon className={styles.icon} />
    </a>
  );
}
