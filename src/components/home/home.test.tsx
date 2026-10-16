import { screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigError } from '@/lib/config/env';
import { ApiError } from '@/lib/http/fetchJson';
import { getExoplanets } from '@/services/exoplanets/exoplanets';
import type { Exoplanet } from '@/services/exoplanets/types';
import { getLatestApodImage } from '@/services/apod/apod';
import { getPlanets } from '@/services/solarSystem/solarSystem';
import type { Planet } from '@/services/solarSystem/types';
import { renderWithIntl } from '@/test/intl';
import { setTestLocale } from '@/test/intlServerMock';
import { ExoplanetsSection } from './ExoplanetsSection/ExoplanetsSection';
import { Hero, HeroFallback } from './Hero/Hero';
import { SolarSystemSection, SolarSystemSectionFallback } from './SolarSystemSection/SolarSystemSection';

vi.mock('next-intl/server', () => import('@/test/intlServerMock'));
vi.mock('@/i18n/navigation', () => import('@/test/mocks').then((m) => m.navigationMock));
vi.mock('next/image', () => import('@/test/mocks').then((m) => m.nextImageMock));
vi.mock('@/services/apod/apod', () => ({ getLatestApodImage: vi.fn() }));
vi.mock('@/services/solarSystem/solarSystem', () => ({ getPlanets: vi.fn() }));
vi.mock('@/services/exoplanets/exoplanets', () => ({ getExoplanets: vi.fn(), EXOPLANET_LIMIT: 10 }));

const NAMES = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];

function planet(name: string, index: number, overrides: Partial<Planet> = {}): Planet {
  return {
    id: name.toLowerCase(),
    slug: name.toLowerCase(),
    name,
    position: index + 1,
    bodyType: 'Planet',
    moons: [],
    mass: null,
    meanRadius: null,
    density: null,
    gravity: null,
    escape: null,
    axialTilt: null,
    semimajorAxis: null,
    sideralOrbit: null,
    sideralRotation: null,
    avgTemp: null,
    ...overrides,
  };
}

const PLANETS = NAMES.map((name, index) =>
  planet(name, index, name === 'Mars' ? { moons: [{ name: 'Phobos', id: 'phobos' }, { name: 'Deimos', id: 'deimos' }] } : {}),
);

function exoplanet(name: string, distance: number | null): Exoplanet {
  return {
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    hostName: null,
    discoveryYear: 2026,
    discoveryMethod: null,
    distance,
    radius: null,
    mass: null,
    orbitalPeriod: null,
    equilibriumTemperature: null,
    density: null,
  };
}

const APOD = {
  title: 'The Milky Way over Manhattan',
  imageUrl: 'https://assets.science.nasa.gov/apod/manhattan.jpg?w=2160',
  alt: 'A black and white view of the Manhattan skyline.',
  date: '2026-10-15',
};

beforeEach(() => {
  setTestLocale('en');
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

async function renderAsync(component: () => Promise<React.JSX.Element>, locale: 'en' | 'es' = 'en') {
  setTestLocale(locale);
  return renderWithIntl(await component(), locale);
}

describe('SolarSystemSection', () => {
  it('renders the eight planets in order with position, type and moons', async () => {
    vi.mocked(getPlanets).mockResolvedValue(PLANETS);
    await renderAsync(SolarSystemSection);

    const section = screen.getByRole('region', { name: 'Solar System' });
    expect(section).toHaveAttribute('id', 'solar-system');
    const links = within(section).getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual(NAMES.map((name) => `/planets/${name.toLowerCase()}`));
    expect(links[3]).toHaveAccessibleName('Mars, 04 / Planet, 2 moons');
    expect(links[0]).toHaveAccessibleName('Mercury, 01 / Planet, 0 moons');
    expect(within(section).getByText('08 planets')).toBeInTheDocument();
  });

  it('is translated to Spanish', async () => {
    vi.mocked(getPlanets).mockResolvedValue(PLANETS);
    await renderAsync(SolarSystemSection, 'es');

    const section = screen.getByRole('region', { name: 'Sistema Solar' });
    expect(within(section).getAllByRole('link')[2]).toHaveAccessibleName('Earth, 03 / Planet, 0 lunas');
    expect(within(section).getByText('08 planetas')).toBeInTheDocument();
  });

  it('shows "Not available" when the body type is missing', async () => {
    vi.mocked(getPlanets).mockResolvedValue([planet('Mars', 3, { position: 4, bodyType: null })]);
    await renderAsync(SolarSystemSection);

    expect(screen.getByRole('link')).toHaveAccessibleName('Mars, 04 / Not available, 0 moons');
  });

  it('shows an error state when the API fails', async () => {
    vi.mocked(getPlanets).mockRejectedValue(new ApiError('http', 'https://api.example.com', 500));
    await renderAsync(SolarSystemSection);

    expect(screen.getByRole('alert')).toHaveTextContent('We could not load this data');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByText(/planets$/)).not.toBeInTheDocument();
  });

  it('shows a configuration error when the token is missing', async () => {
    vi.mocked(getPlanets).mockRejectedValue(new ConfigError('missing-credential', 'SOLAR_SYSTEM_API_TOKEN'));
    await renderAsync(SolarSystemSection);

    expect(screen.getByRole('alert')).toHaveTextContent('an API credential is missing');
  });

  it('shows an empty state for an empty list', async () => {
    vi.mocked(getPlanets).mockResolvedValue([]);
    await renderAsync(SolarSystemSection);

    expect(screen.getByRole('status')).toHaveTextContent('There is nothing to show right now.');
  });

  it('has a loading fallback with eight placeholders', () => {
    const { container } = renderWithIntl(<SolarSystemSectionFallback />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(8);
  });
});

describe('ExoplanetsSection', () => {
  it('renders artist-impression cards with the distance in parsecs', async () => {
    vi.mocked(getExoplanets).mockResolvedValue([exoplanet('DMPP-6 b', 54.6303), exoplanet('CD-35 2722 B b', null)]);
    await renderAsync(ExoplanetsSection, 'es');

    const section = screen.getByRole('region', { name: 'Exoplanetas' });
    const [first, second] = within(section).getAllByRole('link');
    expect(first).toHaveAttribute('href', '/exoplanets/dmpp-6-b');
    expect(first).toHaveAccessibleName('Recreación artística, DMPP-6 b, 54,63 pc');
    expect(second).toHaveAccessibleName('Recreación artística, CD-35 2722 B b, No disponible');
    expect(within(section).getByText('02 mundos seleccionados')).toBeInTheDocument();
  });

  it('shows an error state without affecting other sections', async () => {
    vi.mocked(getExoplanets).mockRejectedValue(new ApiError('network', 'https://api.example.com'));
    vi.mocked(getPlanets).mockResolvedValue(PLANETS);
    setTestLocale('en');
    renderWithIntl(
      <>
        {await SolarSystemSection()}
        {await ExoplanetsSection()}
      </>,
    );

    expect(within(screen.getByRole('region', { name: 'Exoplanets' })).getByRole('alert')).toBeInTheDocument();
    expect(within(screen.getByRole('region', { name: 'Solar System' })).getAllByRole('link')).toHaveLength(8);
  });
});

describe('Hero', () => {
  it('shows the APOD image and title; image and primary button open the original image in a new tab', async () => {
    vi.mocked(getLatestApodImage).mockResolvedValue(APOD);
    await renderAsync(Hero);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('A universe. Within reach.');
    expect(screen.getByText('The Milky Way over Manhattan')).toBeInTheDocument();

    const imageLink = screen.getByRole('link', { name: `${APOD.alt} (opens in a new tab)` });
    expect(imageLink).toHaveAttribute('href', APOD.imageUrl);
    expect(imageLink).toHaveAttribute('target', '_blank');
    expect(imageLink).toHaveAttribute('rel', 'noopener noreferrer');

    const explore = screen.getByRole('link', { name: 'Explore last discovery (opens in a new tab)' });
    expect(explore).toHaveAttribute('href', APOD.imageUrl);
    expect(screen.getByRole('link', { name: 'Discover planets' })).toHaveAttribute('href', '#solar-system');
  });

  it('uses the title as alternative text when the API has no alt', async () => {
    vi.mocked(getLatestApodImage).mockResolvedValue({ ...APOD, alt: null });
    await renderAsync(Hero);

    expect(screen.getByRole('img')).toHaveAttribute('alt', APOD.title);
  });

  it('shows an empty state and hides "Explore last discovery" when there is no image', async () => {
    vi.mocked(getLatestApodImage).mockResolvedValue(null);
    await renderAsync(Hero);

    expect(screen.getByRole('status')).toHaveTextContent('There is nothing to show right now.');
    expect(screen.queryByRole('link', { name: /Explore last discovery/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Discover planets' })).toBeInTheDocument();
  });

  it.each([
    ['error', new ApiError('http', 'https://api.example.com', 503), 'We could not load this data'],
    ['config-error', new ConfigError('missing-credential', 'NASA_API_KEY'), 'an API credential is missing'],
  ])('shows the %s state', async (_, error, text) => {
    vi.mocked(getLatestApodImage).mockRejectedValue(error);
    await renderAsync(Hero);

    expect(screen.getByRole('alert')).toHaveTextContent(text);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('has a loading fallback that keeps the hero text', () => {
    renderWithIntl(<HeroFallback />, 'es');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Un universo. A tu alcance.');
    expect(screen.getByRole('status')).toHaveTextContent('Cargando…');
  });
});
