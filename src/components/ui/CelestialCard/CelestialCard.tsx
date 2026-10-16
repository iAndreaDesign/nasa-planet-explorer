import type { StaticImageData } from 'next/image';
import { Link } from '@/i18n/navigation';
import { CelestialImage } from '../CelestialImage/CelestialImage';
import { ArrowUpRightIcon } from '../icons/ArrowUpRightIcon';
import styles from './CelestialCard.module.scss';

interface CelestialCardProps {
  href: string;
  name: string;
  image: StaticImageData;
  /** Small label above the name (e.g. "Artist impression"). */
  eyebrow?: string;
  /** Secondary lines under the name (e.g. "04 / Planet", "2 moons"). */
  details: readonly string[];
}

/**
 * Planet or exoplanet card; the whole card is one link (specs `solar-system-planets`, `exoplanets`).
 * The explicit label joins the visible texts with commas so screen readers do not run them together.
 */
export function CelestialCard({ href, name, image, eyebrow, details }: CelestialCardProps) {
  const label = [eyebrow, name, ...details].filter(Boolean).join(', ');

  return (
    <Link href={href} className={styles.card} aria-label={label}>
      <CelestialImage image={image} sizes="(min-width: 64rem) 9rem, 7rem" className={styles.image} />
      <span className={styles.body}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <span className={styles.titleRow}>
          <span className={styles.name}>{name}</span>
          <ArrowUpRightIcon className={styles.arrow} />
        </span>
        {details.map((detail) => (
          <span key={detail} className={styles.detail}>
            {detail}
          </span>
        ))}
      </span>
    </Link>
  );
}
