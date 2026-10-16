// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isConfigError } from '@/lib/config/env';
import { isApiError } from '@/lib/http/fetchJson';
import { EXOPLANET_ARCHIVE_ENDPOINT, EXOPLANET_QUERY, getExoplanetBySlug, getExoplanets } from './exoplanets';

const API_KEY = 'nasa-test-key';

// Rows from the live query (2026-10-16), including real null values.
const ROWS = [
  {
    pl_name: 'CD-35 2722 B b',
    hostname: 'CD-35 2722 B',
    disc_year: 2026,
    discoverymethod: 'Radial Velocity',
    sy_dist: null,
    pl_rade: 13.9,
    pl_bmasse: 292.40213444,
    pl_orbper: 171.11,
    pl_eqt: 77.39,
    pl_dens: 0.598,
  },
  {
    pl_name: 'DMPP-2 c',
    hostname: 'DMPP-2',
    disc_year: 2026,
    discoverymethod: 'Radial Velocity',
    sy_dist: 137.94,
    pl_rade: 8.26,
    pl_bmasse: 51.79,
    pl_orbper: 3.168,
    pl_eqt: 1910.88,
    pl_dens: 0.505,
  },
  {
    pl_name: 'Elias 2-24 b',
    hostname: 'Elias 2-24',
    disc_year: 2026,
    discoverymethod: 'Imaging',
    sy_dist: 135.745,
    pl_rade: 13.2,
    pl_bmasse: 937.59380065,
    pl_orbper: null,
    pl_eqt: null,
    pl_dens: 2.24,
  },
];

function mockFetchResponse(body: unknown, status = 200) {
  const fetchMock = vi.fn(async () => Response.json(body, { status }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

beforeEach(() => {
  vi.stubEnv('NASA_API_KEY', API_KEY);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('EXOPLANET_QUERY', () => {
  it('selects every specified column, including pl_dens, ordered by latest discovery without TOP', () => {
    expect(EXOPLANET_QUERY).toBe(
      'select pl_name,hostname,disc_year,discoverymethod,sy_dist,pl_rade,pl_bmasse,pl_orbper,pl_eqt,pl_dens ' +
        'from pscomppars where disc_year is not null order by disc_year desc,pl_name asc',
    );
    expect(EXOPLANET_QUERY).not.toMatch(/\btop\b/i);
  });
});

describe('getExoplanets', () => {
  it('requests the TAP endpoint with the query, JSON format, maxrec=10, api_key and daily revalidation', async () => {
    const fetchMock = mockFetchResponse(ROWS);

    await getExoplanets();

    const [url, init] = fetchMock.mock.calls[0] as unknown as [URL, { next?: { revalidate?: number } }];
    expect(`${url.origin}${url.pathname}`).toBe(EXOPLANET_ARCHIVE_ENDPOINT);
    expect(url.searchParams.get('query')).toBe(EXOPLANET_QUERY);
    expect(url.searchParams.get('format')).toBe('json');
    expect(url.searchParams.get('maxrec')).toBe('10');
    expect(url.searchParams.get('api_key')).toBe(API_KEY);
    expect(init.next).toEqual({ revalidate: 86400 });
  });

  it('maps every field with its API value and keeps the query order', async () => {
    mockFetchResponse(ROWS);

    const exoplanets = await getExoplanets();
    expect(exoplanets.map((exoplanet) => exoplanet.slug)).toEqual(['cd-35-2722-b-b', 'dmpp-2-c', 'elias-2-24-b']);
    expect(exoplanets[1]).toEqual({
      slug: 'dmpp-2-c',
      name: 'DMPP-2 c',
      hostName: 'DMPP-2',
      discoveryYear: 2026,
      discoveryMethod: 'Radial Velocity',
      distance: 137.94,
      radius: 8.26,
      mass: 51.79,
      orbitalPeriod: 3.168,
      equilibriumTemperature: 1910.88,
      density: 0.505,
    });
  });

  it('keeps null values as null', async () => {
    mockFetchResponse(ROWS);

    const [first, , third] = await getExoplanets();
    expect(first?.distance).toBeNull();
    expect(third?.orbitalPeriod).toBeNull();
    expect(third?.equilibriumTemperature).toBeNull();
  });

  it('treats non-numeric values and non-integer years as null', async () => {
    mockFetchResponse([{ pl_name: 'X b', disc_year: 2026.5, sy_dist: 'far', pl_rade: Number.NaN, hostname: ' ' }]);

    const [exoplanet] = await getExoplanets();
    expect(exoplanet).toMatchObject({ discoveryYear: null, distance: null, radius: null, hostName: null });
  });

  it('skips rows without a name and malformed rows', async () => {
    mockFetchResponse([null, 'row', { pl_name: '' }, { hostname: 'No name' }, ...ROWS]);

    await expect(getExoplanets()).resolves.toHaveLength(3);
  });

  it('never returns more than 10 exoplanets', async () => {
    const many = Array.from({ length: 15 }, (_, index) => ({ ...ROWS[1], pl_name: `Planet ${index} b` }));
    mockFetchResponse(many);

    await expect(getExoplanets()).resolves.toHaveLength(10);
  });

  it('gives colliding names unique slugs', async () => {
    mockFetchResponse([
      { ...ROWS[1], pl_name: 'Kepler 1 b' },
      { ...ROWS[1], pl_name: 'Kepler-1 b' },
    ]);

    const slugs = (await getExoplanets()).map((exoplanet) => exoplanet.slug);
    expect(slugs).toEqual(['kepler-1-b', 'kepler-1-b-2']);
  });

  it('returns an empty list for an empty response', async () => {
    mockFetchResponse([]);

    await expect(getExoplanets()).resolves.toEqual([]);
  });

  it('throws an invalid-response ApiError when the body is not a list', async () => {
    mockFetchResponse({ error: 'bad query' });

    const error = await getExoplanets().catch((caught: unknown) => caught);
    expect(isApiError(error) && error.kind).toBe('invalid-response');
  });

  it.each([400, 500])('propagates an http ApiError (%i) without the key', async (status) => {
    mockFetchResponse({ message: 'error' }, status);

    const error = await getExoplanets().catch((caught: unknown) => caught);
    expect(isApiError(error) && error.status).toBe(status);
    expect(String(error)).not.toContain(API_KEY);
  });

  it('throws a ConfigError and makes no request when NASA_API_KEY is missing', async () => {
    vi.stubEnv('NASA_API_KEY', '');
    const fetchMock = mockFetchResponse(ROWS);

    const error = await getExoplanets().catch((caught: unknown) => caught);
    expect(isConfigError(error)).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('getExoplanetBySlug', () => {
  it('returns the exoplanet with that slug', async () => {
    mockFetchResponse(ROWS);

    await expect(getExoplanetBySlug('elias-2-24-b')).resolves.toMatchObject({ name: 'Elias 2-24 b' });
  });

  it.each(['gj-1214-b', 'Elias 2-24 b', ''])('returns null for a slug not in the selection (%j)', async (slug) => {
    mockFetchResponse(ROWS);

    await expect(getExoplanetBySlug(slug)).resolves.toBeNull();
  });
});
