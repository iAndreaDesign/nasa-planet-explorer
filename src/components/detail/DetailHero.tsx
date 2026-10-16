import type { StaticImageData } from 'next/image';
import { Badge, type BadgeTone } from '@/components/ui/Badge/Badge';
import { CelestialImage } from '@/components/ui/CelestialImage/CelestialImage';
import { ChevronIcon } from '@/components/ui/icons/ChevronIcon';
import { Link } from '@/i18n/navigation';
import styles from './DetailHero.module.scss';

export interface AdjacentLink {
  href: string;
  /** Accessible name including the destination, e.g. "Previous planet: Venus". */
  label: string;
}

export interface SummaryItem {
  label: string;
  value: string;
}

interface DetailHeroProps {
  eyebrow: string;
  name: string;
  badge: { label: string; tone: BadgeTone } | null;
  image: StaticImageData;
  /** Short note under the image, e.g. "Artist impression". */
  imageNote?: string;
  summary: readonly SummaryItem[];
  previous: AdjacentLink;
  next: AdjacentLink;
}

/** Name, temperature badge, key figures and image with circular previous/next arrows (spec `detail-navigation`). */
export function DetailHero({ eyebrow, name, badge, image, imageNote, summary, previous, next }: DetailHeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="detail-title">
      <div className={styles.text}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 id="detail-title" className={styles.name}>
          {name}
        </h1>
        {badge && (
          <div>
            <Badge tone={badge.tone}>{badge.label}</Badge>
          </div>
        )}
        {summary.length > 0 && (
          <dl className={styles.summary}>
            {summary.map((item) => (
              <div key={item.label} className={styles.summaryItem}>
                <dt className={styles.summaryLabel}>{item.label}</dt>
                <dd className={styles.summaryValue}>{item.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      <div className={styles.media}>
        <Link href={previous.href} className={`${styles.arrow} ${styles.previous}`} aria-label={previous.label}>
          <ChevronIcon direction="left" className={styles.arrowIcon} />
        </Link>
        <CelestialImage image={image} priority sizes="(min-width: 64rem) 30rem, 70vw" className={styles.image} />
        <Link href={next.href} className={`${styles.arrow} ${styles.next}`} aria-label={next.label}>
          <ChevronIcon direction="right" className={styles.arrowIcon} />
        </Link>
        {imageNote && <p className={styles.imageNote}>{imageNote}</p>}
      </div>
    </section>
  );
}
