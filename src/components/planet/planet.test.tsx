import { screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PlanetPage from '@/app/[locale]/planets/[slug]/page';
import { ConfigError } from '@/lib/config/env';
import { ApiError } from '@/lib/http/fetchJson';
import { MARS, UNORDERED_PLANETS } from '@/services/solarSystem/fixtures';
import { orderPlanets, toUnorderedPlanet } from '@/services/solarSystem/mappers';
import { getPlanets } from '@/services/solarSystem/solarSystem';
import type { Planet } from '@/services/solarSystem/types';
import { renderWithIntl } from '@/test/intl';
import { setTestLocale } from '@/test/intlServerMock';
import { PlanetDetail } from './PlanetDetail';

vi.mock('next-intl/server', () => import('@/test/intlServerMock'));
vi.mock('@/i18n/navigation', () => import('@/test/mocks').then((m) => m.navigationMock));
vi.mock('next/image', () => import('@/test/mocks').then((m) => m.nextImageMock));
vi.mock('@/services/solarSystem/solarSystem', () => ({ getPlanets: vi.fn() }));
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

const PLANETS: Planet[] = orderPlanets(
  UNORDERED_PLANETS.map((body) => toUnorderedPlanet(body === MARS ? MARS : body)).filter((planet) => planet !== null),
);
const byName = (name: string) => {
  const planet = PLANETS.find((candidate) => candidate.name === name);
  if (!planet) throw new Error(`fixture ${name}`);
  return planet;
};

function renderMars(locale: 'en' | 'es' = 'en', overrides: Partial<Planet> = {}) {
  return renderWithIntl(
    <PlanetDetail planet={{ ...byName('Mars'), ...overrides }} adjacent={{ previous: byName('Earth'), next: byName('Jupiter') }} />,
    locale,
  );
}

function definitionOf(term: string): HTMLElement {
  const dt = screen.getByText(term, { selector: 'dt, dt *' }).closest('dt');
  const dd = dt?.nextElementSibling;
  if (!(dd instanceof HTMLElement)) throw new Error(`No value for ${term}`);
  return dd;
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('PlanetDetail', () => {
  it('renders the hero with position, name, orbital period and moons', () => {
    renderMars();

    expect(screen.getByRole('heading', { level: 1, name: 'Mars' })).toBeInTheDocument();
    expect(screen.getByText('04 / Solar System')).toBeInTheDocument();
    expect(definitionOf('Known moons')).toHaveTextContent('2 moons');
    expect(screen.getAllByText('Orbital period', { selector: 'dt, dt *' })).toHaveLength(2);
  });

  it('shows every required property with the API units', () => {
    renderMars();

    expect(definitionOf('Mass')).toHaveTextContent('6.42 × 10²³kg');
    expect(definitionOf('Mean radius')).toHaveTextContent('3,389.5km');
    expect(definitionOf('Density')).toHaveTextContent('3.934g/cm³');
    expect(definitionOf('Surface gravity')).toHaveTextContent('3.71m/s²');
    expect(definitionOf('Escape velocity')).toHaveTextContent('5,030m/s');
    expect(definitionOf('Axial tilt')).toHaveTextContent('25.19°');
    expect(definitionOf('Semi-major axis')).toHaveTextContent('227,939,200km');
    expect(definitionOf('Rotation period')).toHaveTextContent('24.62hours');
    expect(definitionOf('Average temperature')).toHaveTextContent('210K');
    for (const title of ['Physical properties', 'Orbit and rotation', 'Temperature']) {
      expect(screen.getByRole('heading', { level: 2, name: title })).toBeInTheDocument();
    }
  });

  it('formats numbers and translates labels in Spanish', () => {
    renderMars('es');

    expect(screen.getByText('04 / Sistema Solar')).toBeInTheDocument();
    expect(definitionOf('Gravedad superficial')).toHaveTextContent('3,71m/s²');
    expect(definitionOf('Periodo de rotación')).toHaveTextContent('24,62horas');
    expect(definitionOf('Lunas conocidas')).toHaveTextContent('2 lunas');
  });

  it.each([
    ['en', 'Not available'],
    ['es', 'No disponible'],
  ] as const)('shows missing values as "%s"', (locale, text) => {
    renderMars(locale, { mass: null, density: null, avgTemp: null, sideralOrbit: null });

    const label = locale === 'en' ? ['Mass', 'Density', 'Average temperature'] : ['Masa', 'Densidad', 'Temperatura media'];
    for (const term of label) expect(definitionOf(term)).toHaveTextContent(text);
  });

  it.each([
    ['en', 210, 'Cold'],
    ['es', 210, 'Frío'],
    ['en', 737, 'Hot'],
    ['es', 737, 'Caliente'],
  ] as const)('shows a temperature badge (%s, %s K → %s)', (locale, avgTemp, label) => {
    renderMars(locale, { avgTemp });

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it.each([288, null])('shows no badge for a temperate or unknown temperature (%s)', (avgTemp) => {
    const { container } = renderMars('en', { avgTemp });

    for (const label of ['Cold', 'Hot', 'Planet']) expect(screen.queryByText(label)).not.toBeInTheDocument();
    expect(container.querySelector('[class*="badge"]')).toBeNull();
  });

  it('keeps a retrograde (negative) rotation', () => {
    renderMars('en', { sideralRotation: -5832.5 });

    expect(definitionOf('Rotation period')).toHaveTextContent('-5,832.5hours');
  });

  it('links to the previous and next planets with accessible names', () => {
    renderMars('es');

    expect(screen.getByRole('link', { name: 'Planeta anterior: Earth' })).toHaveAttribute('href', '/planets/earth');
    expect(screen.getByRole('link', { name: 'Planeta siguiente: Jupiter' })).toHaveAttribute('href', '/planets/jupiter');
  });

  it('renders the breadcrumb and the back link', () => {
    renderMars();

    const breadcrumb = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(within(breadcrumb).getByRole('link', { name: 'All planets' })).toHaveAttribute('href', '/');
    expect(within(breadcrumb).getByRole('link', { name: 'Solar System' })).toHaveAttribute('href', '/#solar-system');
    expect(within(breadcrumb).getByText('Mars')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Back to all planets' })).toHaveAttribute('href', '/');
  });
});

describe('PlanetPage', () => {
  const params = (slug: string, locale = 'en') => ({ params: Promise.resolve({ locale, slug }) });

  async function renderPage(slug: string) {
    setTestLocale('en');
    return renderWithIntl(await PlanetPage(params(slug)));
  }

  it.each([
    ['mercury', 'Previous planet: Neptune', 'Next planet: Venus'],
    ['neptune', 'Previous planet: Uranus', 'Next planet: Mercury'],
    ['earth', 'Previous planet: Venus', 'Next planet: Mars'],
  ])('navigates circularly from %s', async (slug, previous, next) => {
    vi.mocked(getPlanets).mockResolvedValue(PLANETS);
    await renderPage(slug);

    expect(screen.getByRole('link', { name: previous })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: next })).toBeInTheDocument();
  });

  it('calls notFound for an unknown slug', async () => {
    vi.mocked(getPlanets).mockResolvedValue(PLANETS);

    await expect(PlanetPage(params('pluto'))).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('calls notFound for an unsupported locale', async () => {
    await expect(PlanetPage(params('mars', 'fr'))).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it.each([
    ['error', new ApiError('http', 'https://api.example.com', 500)],
    ['config-error', new ConfigError('missing-credential', 'SOLAR_SYSTEM_API_TOKEN')],
  ])('shows the %s state with a way back', async (_, error) => {
    vi.mocked(getPlanets).mockRejectedValue(error);
    await renderPage('mars');

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to all planets' })).toHaveAttribute('href', '/');
  });
});
