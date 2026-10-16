// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isConfigError } from '@/lib/config/env';
import { isApiError } from '@/lib/http/fetchJson';
import { PHOBOS, UNORDERED_PLANETS } from './fixtures';
import { getMoon, getPlanetBySlug, getPlanets } from './solarSystem';

const TOKEN = 'solar-test-token';

type FetchCall = [URL, { headers?: Record<string, string>; next?: { revalidate?: number } }];

function mockFetchResponse(body: unknown, status = 200) {
  const fetchMock = vi.fn(async () => Response.json(body, { status }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function firstCall(fetchMock: ReturnType<typeof mockFetchResponse>): FetchCall {
  return fetchMock.mock.calls[0] as unknown as FetchCall;
}

beforeEach(() => {
  vi.stubEnv('SOLAR_SYSTEM_API_TOKEN', TOKEN);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('getPlanets', () => {
  it('requests planets with the isPlanet filter, the Bearer token and daily revalidation', async () => {
    const fetchMock = mockFetchResponse({ bodies: UNORDERED_PLANETS });

    await getPlanets();

    const [url, init] = firstCall(fetchMock);
    expect(`${url.origin}${url.pathname}`).toBe('https://api.le-systeme-solaire.net/rest/bodies/');
    expect(url.searchParams.getAll('filter[]')).toEqual(['isPlanet,eq,true']);
    expect(init.headers?.Authorization).toBe(`Bearer ${TOKEN}`);
    expect(init.next).toEqual({ revalidate: 86400 });
  });

  it('returns the eight planets ordered by distance from the Sun', async () => {
    mockFetchResponse({ bodies: UNORDERED_PLANETS });

    const planets = await getPlanets();
    expect(planets.map((planet) => planet.slug)).toEqual([
      'mercury',
      'venus',
      'earth',
      'mars',
      'jupiter',
      'saturn',
      'uranus',
      'neptune',
    ]);
    expect(planets.map((planet) => planet.position)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('reports 0 moons for planets with null or empty moons', async () => {
    mockFetchResponse({ bodies: UNORDERED_PLANETS });

    const planets = await getPlanets();
    expect(planets.find((planet) => planet.slug === 'mercury')?.moons).toEqual([]);
    expect(planets.find((planet) => planet.slug === 'venus')?.moons).toEqual([]);
    expect(planets.find((planet) => planet.slug === 'mars')?.moons).toHaveLength(2);
  });

  it('skips malformed bodies', async () => {
    mockFetchResponse({ bodies: [...UNORDERED_PLANETS, null, 'x', { englishName: 'No id' }] });

    await expect(getPlanets()).resolves.toHaveLength(8);
  });

  it.each([[{}], [{ bodies: 'none' }], [[]]])('throws an invalid-response ApiError for %j', async (body) => {
    mockFetchResponse(body);

    const error = await getPlanets().catch((caught: unknown) => caught);
    expect(isApiError(error) && error.kind).toBe('invalid-response');
  });

  it.each([401, 500])('propagates an http ApiError (%i) without the token', async (status) => {
    mockFetchResponse({ message: 'error' }, status);

    const error = await getPlanets().catch((caught: unknown) => caught);
    expect(isApiError(error) && error.status).toBe(status);
    expect(String(error)).not.toContain(TOKEN);
  });

  it('throws a ConfigError and makes no request when the token is missing', async () => {
    vi.stubEnv('SOLAR_SYSTEM_API_TOKEN', '');
    const fetchMock = mockFetchResponse({ bodies: UNORDERED_PLANETS });

    const error = await getPlanets().catch((caught: unknown) => caught);
    expect(isConfigError(error)).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('getPlanetBySlug', () => {
  it('returns the planet with its position', async () => {
    mockFetchResponse({ bodies: UNORDERED_PLANETS });

    const earth = await getPlanetBySlug('earth');
    expect(earth).toMatchObject({ id: 'terre', name: 'Earth', position: 3 });
  });

  it.each(['pluto', 'terre', ''])('returns null for unknown slug %j', async (slug) => {
    mockFetchResponse({ bodies: UNORDERED_PLANETS });

    await expect(getPlanetBySlug(slug)).resolves.toBeNull();
  });
});

describe('getMoon', () => {
  it('requests the moon body with the Bearer token and maps it', async () => {
    const fetchMock = mockFetchResponse(PHOBOS);

    await expect(getMoon('phobos')).resolves.toEqual({
      id: 'phobos',
      name: 'Phobos',
      meanRadius: 11.1,
      mass: { value: 1.06, exponent: 16 },
      density: 1.876,
      gravity: 0.0057,
    });
    const [url, init] = firstCall(fetchMock);
    expect(url.toString()).toBe('https://api.le-systeme-solaire.net/rest/bodies/phobos');
    expect(init.headers?.Authorization).toBe(`Bearer ${TOKEN}`);
  });

  it.each(['../bodies', 'https://evil.example.com', 'Phobos', ''])(
    'rejects invalid id %j without making a request',
    async (id) => {
      const fetchMock = mockFetchResponse(PHOBOS);

      await expect(getMoon(id)).rejects.toThrow(RangeError);
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it('propagates a 404 ApiError for an unknown moon', async () => {
    mockFetchResponse({ message: 'not found' }, 404);

    const error = await getMoon('unknown').catch((caught: unknown) => caught);
    expect(isApiError(error) && error.status).toBe(404);
  });

  it('throws an invalid-response ApiError when the body is not an object', async () => {
    mockFetchResponse([PHOBOS]);

    const error = await getMoon('phobos').catch((caught: unknown) => caught);
    expect(isApiError(error) && error.kind).toBe('invalid-response');
  });
});
