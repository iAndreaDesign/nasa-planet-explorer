import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { ButtonLink } from '@/components/ui/ButtonLink/ButtonLink';
import { StatusMessage } from '@/components/ui/StatusMessage/StatusMessage';
import { safeLoad } from '@/lib/data/safeLoad';
import { getLatestApodImage } from '@/services/apod/apod';
import type { ApodImage } from '@/services/apod/types';
import { SOLAR_SYSTEM_SECTION_ID } from '../SolarSystemSection/SolarSystemSection';
import styles from './Hero.module.scss';

interface HeroLayoutProps {
  /** APOD image URL for "Explore last discovery"; the button is hidden without it. */
  discoveryUrl: string | null;
  media: ReactNode;
}

function HeroLayout({ discoveryUrl, media }: HeroLayoutProps) {
  const t = useTranslations('home.hero');

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.text}>
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.line}>{t('titleLine1')}</span> <span className={styles.line}>{t('titleLine2')}</span>
        </h1>
        <p className={styles.description}>{t('description')}</p>
        <div className={styles.actions}>
          {discoveryUrl && (
            <ButtonLink href={discoveryUrl} external>
              {t('exploreDiscovery')}
            </ButtonLink>
          )}
          <ButtonLink href={`#${SOLAR_SYSTEM_SECTION_ID}`} variant="secondary">
            {t('discoverPlanets')}
          </ButtonLink>
        </div>
      </div>
      <div className={styles.media}>{media}</div>
    </section>
  );
}

function ApodFigure({ apod }: { apod: ApodImage }) {
  const t = useTranslations('home.hero');
  const tUi = useTranslations('ui');
  const alt = apod.alt ?? apod.title;

  return (
    <figure className={styles.figure}>
      <a
        href={apod.imageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.imageLink}
        aria-label={`${alt} ${tUi('opensInNewTab')}`}
      >
        <Image
          src={apod.imageUrl}
          alt={alt}
          fill
          priority
          sizes="(min-width: 64rem) 34rem, calc(100vw - 2rem)"
          className={styles.image}
        />
      </a>
      <figcaption className={styles.caption}>
        <span className={styles.captionLabel}>{t('apodLabel')}</span>
        <span className={styles.captionTitle}>{apod.title}</span>
      </figcaption>
    </figure>
  );
}

/** Hero with the latest Astronomy Picture of the Day image (spec `astronomy-picture`). */
export async function Hero() {
  const result = await safeLoad('apod', getLatestApodImage);

  if (result.status !== 'ok') {
    return <HeroLayout discoveryUrl={null} media={<StatusMessage variant={result.status} />} />;
  }
  if (result.data === null) {
    return <HeroLayout discoveryUrl={null} media={<StatusMessage variant="empty" />} />;
  }
  return <HeroLayout discoveryUrl={result.data.imageUrl} media={<ApodFigure apod={result.data} />} />;
}

export function HeroFallback() {
  const tStates = useTranslations('ui.states');

  return (
    <HeroLayout
      discoveryUrl={null}
      media={
        <div role="status" aria-busy="true" className={styles.skeleton}>
          <span className={styles.visuallyHidden}>{tStates('loading')}</span>
        </div>
      }
    />
  );
}
