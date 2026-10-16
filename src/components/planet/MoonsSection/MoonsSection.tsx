'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useId, useState } from 'react';
import { ChevronIcon } from '@/components/ui/icons/ChevronIcon';
import { formatNumber } from '@/lib/format/number';
import { formatScientific } from '@/lib/format/scientific';
import type { MoonRef } from '@/services/solarSystem/types';
import styles from './MoonsSection.module.scss';
import { type MoonState, useMoonData } from './useMoonData';

/** Maximum number of moons listed and requested (decision D11). */
export const MAX_MOONS = 10;

interface MoonsSectionProps {
  moons: readonly MoonRef[];
}

/** Collapsible "Moons (N)" section; moon data is requested only when expanded (spec `planet-moons`). */
export function MoonsSection({ moons }: MoonsSectionProps) {
  const t = useTranslations('moons');
  const [expanded, setExpanded] = useState(false);
  const { states, load } = useMoonData();
  const panelId = useId();
  const headingId = useId();
  const shown = moons.slice(0, MAX_MOONS);

  const toggle = () => {
    if (!expanded) load(shown);
    setExpanded(!expanded);
  };

  return (
    <section aria-labelledby={headingId} className={styles.section}>
      <h2 id={headingId} className={styles.heading}>
        <button type="button" aria-expanded={expanded} aria-controls={panelId} onClick={toggle} className={styles.toggle}>
          <span>{t('title', { count: moons.length })}</span>
          <ChevronIcon direction="right" className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`} />
        </button>
      </h2>
      <div id={panelId} hidden={!expanded} className={styles.panel}>
        {moons.length === 0 ? (
          <p className={styles.note}>{t('none')}</p>
        ) : (
          <>
            <ul className={styles.list}>
              {shown.map((ref, index) => (
                <li key={ref.id ?? `${ref.name}-${index}`} className={styles.item}>
                  <MoonCard moonRef={ref} state={ref.id === null ? { status: 'error' } : states[ref.id]} />
                </li>
              ))}
            </ul>
            {moons.length > MAX_MOONS && (
              <p className={styles.note}>{t('showing', { shown: shown.length, total: moons.length })}</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function MoonCard({ moonRef, state }: { moonRef: MoonRef; state: MoonState | undefined }) {
  const t = useTranslations('moons');
  const tProperties = useTranslations('planet.properties');
  const tCommon = useTranslations('common');
  const tStates = useTranslations('ui.states');
  const locale = useLocale();

  if (state?.status !== 'ok') {
    const message = moonRef.id === null ? t('unavailable') : state?.status === 'error' ? t('loadError') : tStates('loading');
    return (
      <div className={styles.card}>
        <h3 className={styles.name}>{moonRef.name}</h3>
        <p role={state?.status === 'error' ? 'alert' : 'status'} className={styles.state}>
          {message}
        </p>
      </div>
    );
  }

  const { moon } = state;
  const value = (formatted: string | null, unit: string) => (formatted === null ? tCommon('notAvailable') : `${formatted} ${unit}`);
  const rows = [
    { label: tProperties('meanRadius'), value: value(formatNumber(moon.meanRadius, locale, { maximumFractionDigits: 1 }), 'km') },
    { label: tProperties('mass'), value: value(moon.mass && formatScientific(moon.mass.value, moon.mass.exponent, locale), 'kg') },
    { label: tProperties('density'), value: value(formatNumber(moon.density, locale, { maximumFractionDigits: 3 }), 'g/cm³') },
    { label: tProperties('gravity'), value: value(formatNumber(moon.gravity, locale, { maximumFractionDigits: 4 }), 'm/s²') },
  ];

  return (
    <div className={styles.card}>
      <h3 className={styles.name}>{moon.name}</h3>
      <dl className={styles.properties}>
        {rows.map((row) => (
          <div key={row.label} className={styles.row}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
