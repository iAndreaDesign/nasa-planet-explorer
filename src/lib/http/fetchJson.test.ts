// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, fetchJson, isApiError, sanitizeUrl } from './fetchJson';

const SECRET = 'secret-key-123';
const URL_WITH_KEY = `https://api.example.com/data?api_key=${SECRET}&page=1`;

function mockFetch(implementation: () => Promise<Response>) {
  const fetchMock = vi.fn(implementation);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

async function captureApiError(promise: Promise<unknown>): Promise<ApiError> {
  try {
    await promise;
  } catch (error) {
    if (isApiError(error)) return error;
    throw error;
  }
  throw new Error('Expected an ApiError');
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('sanitizeUrl', () => {
  it('redacts the api_key query parameter and keeps the rest', () => {
    const sanitized = sanitizeUrl(URL_WITH_KEY);

    expect(sanitized).not.toContain(SECRET);
    expect(sanitized).toContain('api_key=%5Bredacted%5D');
    expect(sanitized).toContain('page=1');
  });

  it('leaves URLs without credentials unchanged', () => {
    expect(sanitizeUrl('https://api.example.com/data?page=1')).toBe('https://api.example.com/data?page=1');
  });
});

describe('fetchJson', () => {
  it('returns the parsed JSON body', async () => {
    mockFetch(async () => Response.json({ ok: true }));

    await expect(fetchJson(URL_WITH_KEY)).resolves.toEqual({ ok: true });
  });

  it('sends the Accept header, custom headers, a timeout signal and the revalidate option', async () => {
    const fetchMock = mockFetch(async () => Response.json([]));

    await fetchJson('https://api.example.com/data', {
      headers: { Authorization: 'Bearer token' },
      revalidate: 60,
    });

    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit & { next?: { revalidate?: number } }];
    expect(init.headers).toEqual({ Accept: 'application/json', Authorization: 'Bearer token' });
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(init.next).toEqual({ revalidate: 60 });
  });

  it('does not send a next option when revalidate is not given', async () => {
    const fetchMock = mockFetch(async () => Response.json([]));

    await fetchJson('https://api.example.com/data');

    const [, init] = fetchMock.mock.calls[0] as unknown as [string, Record<string, unknown>];
    expect(init).not.toHaveProperty('next');
  });

  it.each([400, 401, 404, 500, 503])('throws an http ApiError for status %i without leaking the key', async (status) => {
    mockFetch(async () => new Response('error', { status }));

    const error = await captureApiError(fetchJson(URL_WITH_KEY));
    expect(error.kind).toBe('http');
    expect(error.status).toBe(status);
    expect(error.message).not.toContain(SECRET);
    expect(error.url).not.toContain(SECRET);
  });

  it('throws a network ApiError when fetch rejects, without the original message', async () => {
    mockFetch(async () => {
      throw new TypeError(`fetch failed for ${URL_WITH_KEY}`);
    });

    const error = await captureApiError(fetchJson(URL_WITH_KEY));
    expect(error.kind).toBe('network');
    expect(error.status).toBeNull();
    expect(JSON.stringify({ message: error.message, url: error.url, cause: error.cause })).not.toContain(SECRET);
  });

  it('throws an invalid-response ApiError when the body is not JSON', async () => {
    mockFetch(async () => new Response('<html>not json</html>', { status: 200 }));

    const error = await captureApiError(fetchJson(URL_WITH_KEY));
    expect(error.kind).toBe('invalid-response');
    expect(error.message).not.toContain(SECRET);
  });
});
