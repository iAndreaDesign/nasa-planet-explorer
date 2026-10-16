import { screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ExoplanetPage from '@/app/[locale]/exoplanets/[slug]/page';
import { ConfigError } from '@/lib/config/env';
import { ApiError } from '@/lib/http/fetchJson';
import { getExoplanets } from '@/services/exoplanets/exoplanets';
import type { Exoplanet } from '@/services/exoplanets/types';
import { renderWithIntl } from '@/test/intl';
import { setTestLocale } from '@/test/intlServerMock';
import { ExoplanetDetail } from './ExoplanetDetail';

vi.mock('next-intl/server', () => import('@/test/intlServerMock'));
vi.mock('@/i18n/navigation', () => import('@/test/mocks').then((m) => m.navigationMock));
vi.mock('next/image', () => import('@/test/mocks').then((m) => m.nextImageMock));
vi.mock('@/services/exoplanets/exoplanets', () => ({ getExoplanets: vi.fn() }));
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

// Values from the live query (2026-10-16).
const DMPP_6_B: Exoplanet = {
  slug: 'dmpp-6-b',
  name: 'DMPP-6 b',
  hostName: 'DMPP-6',
  discoveryYear: 2026,
  discoveryMethod: 'Radial Velocity',
  distance: 54.6303,
  radius: 2.28,
  mass: 5.8,
  orbitalPeriod: 7.6027,
  equilibriumTemperature: 1203.65,
  density: 2.69,
};
const CD_35: Exoplanet = {
  slug: 'cd-35-2722-b-b',
  name: 'CD-35 2722 B b',
  hostName: 'CD-35 2722 B',
  discoveryYear: 2026,
  discoveryMethod: 'Radial Velocity',
  distance: null,
  radius: 13.9,
  mass: 292.40213444,
  orbitalPeriod: 171.11,
  equilibriumTemperature: 77.39,
  density: 0.598,
};
const ELIAS: Exoplanet = {
  slug: 'elias-2-24-b',
  name: 'Elias 2-24 b',
  hostName: 'Elias 2-24',
  discoveryYear: 2026,
  discoveryMethod: 'Imaging',
  distance: 135.745,
  radius: 13.2,
  mass: 937.59380065,
  orbitalPeriod: null,
  equilibriumTemperature: null,
  density: 2.24,
};
const SELECTION = [CD_35, DMPP_6_B, ELIAS];

function definitionOf(term: string): HTMLElement {
  const dt = screen.getAllByText(term, { selector: 'dt, dt *' })[0]?.closest('dt');
  const dd = dt?.nextElementSibling;
  if (!(dd instanceof HTMLElement)) throw new Error(`No value for ${term}`);
  return dd;
}

function renderDetail(exoplanet: Exoplanet, locale: 'en' | 'es' = 'en') {
  return renderWithIntl(<ExoplanetDetail exoplanet={exoplanet} index={1} adjacent={{ previous: CD_35, next: ELIAS }} />, locale);
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ExoplanetDetail', () => {
  it('renders the hero with position, name, hot badge, artist impression and key figures', () => {
    renderDetail(DMPP_6_B);

    expect(screen.getByRole('heading', { level: 1, name: 'DMPP-6 b' })).toBeInTheDocument();
    expect(screen.getByText('02 / Exoplanets')).toBeInTheDocument();
    expect(screen.getByText('Hot')).toBeInTheDocument();
    expect(screen.getByText('Artist impression')).toBeInTheDocument();
    expect(definitionOf('Equilibrium temperature')).toHaveTextContent('1,203.65 K');
  });

  it('shows every field returned by the API with its unit', () => {
    renderDetail(DMPP_6_B);

    expect(definitionOf('Host star')).toHaveTextContent('DMPP-6');
    expect(definitionOf('Discovery year')).toHaveTextContent('2026');
    expect(definitionOf('Discovery year')).not.toHaveTextContent('2,026');
    expect(definitionOf('Discovery method')).toHaveTextContent('Radial Velocity');
    expect(definitionOf('Distance')).toHaveTextContent('54.63parsecs');
    expect(definitionOf('Radius')).toHaveTextContent('2.28Earth radii');
    expect(definitionOf('Mass')).toHaveTextContent('5.8Earth masses');
    expect(definitionOf('Density')).toHaveTextContent('2.69g/cm³');
    expect(definitionOf('Orbital period')).toHaveTextContent('7.6 days');
    expect(screen.getAllByText('Orbital period', { selector: 'dt, dt *' })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
      'Discovery',
      'Physical properties',
    ]);
  });

  it('translates labels, units and the badge to Spanish', () => {
    renderDetail(CD_35, 'es');

    expect(screen.getByText('Frío')).toBeInTheDocument();
    expect(screen.getByText('Recreación artística')).toBeInTheDocument();
    expect(definitionOf('Radio')).toHaveTextContent('13,9radios terrestres');
    expect(definitionOf('Masa')).toHaveTextContent('292,4masas terrestres');
    expect(definitionOf('Distancia')).toHaveTextContent('No disponible');
  });

  it('shows missing values as "Not available" and no badge without temperature', () => {
    renderDetail(ELIAS);

    expect(definitionOf('Equilibrium temperature')).toHaveTextContent('Not available');
    expect(definitionOf('Orbital period')).toHaveTextContent('Not available');
    expect(screen.queryByText('Hot')).not.toBeInTheDocument();
    expect(screen.queryByText('Cold')).not.toBeInTheDocument();
  });

  it('links to the previous and next exoplanets and back home', () => {
    renderDetail(DMPP_6_B, 'es');

    expect(screen.getByRole('link', { name: 'Exoplaneta anterior: CD-35 2722 B b' })).toHaveAttribute('href', '/exoplanets/cd-35-2722-b-b');
    expect(screen.getByRole('link', { name: 'Exoplaneta siguiente: Elias 2-24 b' })).toHaveAttribute('href', '/exoplanets/elias-2-24-b');
    const breadcrumb = screen.getByRole('navigation', { name: 'Ruta de navegación' });
    expect(within(breadcrumb).getByRole('link', { name: 'Exoplanetas' })).toHaveAttribute('href', '/#exoplanets');
    expect(within(breadcrumb).getByText('DMPP-6 b')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Volver a todos los planetas' })).toHaveAttribute('href', '/');
  });
});

describe('ExoplanetPage', () => {
  const params = (slug: string, locale = 'en') => ({ params: Promise.resolve({ locale, slug }) });

  async function renderPage(slug: string) {
    setTestLocale('en');
    return renderWithIntl(await ExoplanetPage(params(slug)));
  }

  it.each([
    ['cd-35-2722-b-b', 'Previous exoplanet: Elias 2-24 b', 'Next exoplanet: DMPP-6 b'],
    ['elias-2-24-b', 'Previous exoplanet: DMPP-6 b', 'Next exoplanet: CD-35 2722 B b'],
  ])('navigates circularly from %s', async (slug, previous, next) => {
    vi.mocked(getExoplanets).mockResolvedValue(SELECTION);
    await renderPage(slug);

    expect(screen.getByRole('link', { name: previous })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: next })).toBeInTheDocument();
  });

  it('uses the position in the selection for the eyebrow', async () => {
    vi.mocked(getExoplanets).mockResolvedValue(SELECTION);
    await renderPage('elias-2-24-b');

    expect(screen.getByText('03 / Exoplanets')).toBeInTheDocument();
  });

  it('calls notFound for a slug outside the selection', async () => {
    vi.mocked(getExoplanets).mockResolvedValue(SELECTION);

    await expect(ExoplanetPage(params('gj-1214-b'))).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it.each([
    ['error', new ApiError('http', 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync', 500)],
    ['config-error', new ConfigError('missing-credential', 'NASA_API_KEY')],
  ])('shows the %s state with a way back', async (_, error) => {
    vi.mocked(getExoplanets).mockRejectedValue(error);
    await renderPage('dmpp-6-b');

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to all planets' })).toHaveAttribute('href', '/');
  });
});
