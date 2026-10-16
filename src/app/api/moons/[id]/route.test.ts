// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigError } from '@/lib/config/env';
import { ApiError } from '@/lib/http/fetchJson';
import { getMoon } from '@/services/solarSystem/solarSystem';
import { GET } from './route';

vi.mock('@/services/solarSystem/solarSystem', () => ({ getMoon: vi.fn() }));

const PHOBOS = { id: 'phobos', name: 'Phobos', meanRadius: 11.1, mass: { value: 1.06, exponent: 16 }, density: 1.872, gravity: 0.0057 };
const call = (id: string) => GET(new Request(`http://localhost/api/moons/${id}`), { params: Promise.resolve({ id }) });

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.mocked(getMoon).mockReset();
});

describe('GET /api/moons/[id]', () => {
  it('returns the moon data with cache headers', async () => {
    vi.mocked(getMoon).mockResolvedValue(PHOBOS);

    const response = await call('phobos');
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(PHOBOS);
    expect(response.headers.get('Cache-Control')).toContain('s-maxage=86400');
    expect(getMoon).toHaveBeenCalledWith('phobos');
  });

  it.each(['..', 'Phobos', 'a b', '%2e%2e', 'x'.repeat(65)])('rejects invalid id %j without calling the API', async (id) => {
    const response = await call(id);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'invalid-id' });
    expect(getMoon).not.toHaveBeenCalled();
  });

  it('answers 503 config-error when the token is missing', async () => {
    vi.mocked(getMoon).mockRejectedValue(new ConfigError('missing-credential', 'SOLAR_SYSTEM_API_TOKEN'));

    const response = await call('phobos');
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ error: 'config-error' });
  });

  it('answers 404 when the API does not know the body', async () => {
    vi.mocked(getMoon).mockRejectedValue(new ApiError('http', 'https://api.le-systeme-solaire.net/rest/bodies/x', 404));

    expect((await call('unknown')).status).toBe(404);
  });

  it.each([
    new ApiError('http', 'https://api.le-systeme-solaire.net/rest/bodies/phobos', 500),
    new ApiError('network', 'https://api.le-systeme-solaire.net/rest/bodies/phobos'),
    new Error('boom'),
  ])('answers 502 upstream-error for %s, without details', async (error) => {
    vi.mocked(getMoon).mockRejectedValue(error);

    const response = await call('phobos');
    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({ error: 'upstream-error' });
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });
});
