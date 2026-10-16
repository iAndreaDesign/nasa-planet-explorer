// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isConfigError } from '@/lib/config/env';
import { isApiError } from '@/lib/http/fetchJson';
import { APOD_ENDPOINT, getLatestApodImage } from './apod';

const API_KEY = 'nasa-test-key';

// Shapes taken from the real endpoint (2026-10-16), trimmed to the relevant fields.
const videoEntry = {
  date: '2026-10-16',
  title: 'Chasing the International Space Station',
  media_type: 'video',
  alt: 'Video of a rocket launch in dark,  predawn skies as seen from the beach..',
  url: 'https://science.nasa.gov/image-article/apod-2026-october-16-chasing-the-international-space-station/',
  hdurl: '',
};

const imageEntry = {
  date: '2026-10-14',
  title: 'Mars and the Beehive Under an Aurora',
  media_type: 'image',
  alt: 'The bright Mars is near the center of the Beehive cluster (M44) in the sky&#039;s horizon.',
  url: 'https://science.nasa.gov/image-article/apod-2026-october-14-mars-and-the-beehive-under-an-aurora/',
  hdurl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/cds/apod/apod/2026/october/beehive.png?w=1500&h=1000',
};

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

describe('getLatestApodImage', () => {
  it('requests the APOD endpoint with the api_key parameter and hourly revalidation', async () => {
    const fetchMock = mockFetchResponse([imageEntry]);

    await getLatestApodImage();

    const [url, init] = fetchMock.mock.calls[0] as unknown as [URL, { next?: { revalidate?: number } }];
    expect(`${url.origin}${url.pathname}`).toBe(APOD_ENDPOINT);
    expect(url.searchParams.get('api_key')).toBe(API_KEY);
    expect(init.next).toEqual({ revalidate: 3600 });
  });

  it('maps the latest image entry to the domain model', async () => {
    mockFetchResponse([imageEntry]);

    await expect(getLatestApodImage()).resolves.toEqual({
      title: 'Mars and the Beehive Under an Aurora',
      imageUrl: imageEntry.hdurl,
      alt: "The bright Mars is near the center of the Beehive cluster (M44) in the sky's horizon.",
      date: '2026-10-14',
    });
  });

  it('skips a video entry and returns the next image', async () => {
    mockFetchResponse([videoEntry, imageEntry]);

    const image = await getLatestApodImage();
    expect(image?.title).toBe(imageEntry.title);
  });

  it('skips image entries without a usable hdurl', async () => {
    const noHdurl = { ...imageEntry, title: 'No hdurl', hdurl: '' };
    const badProtocol = { ...imageEntry, title: 'Bad protocol', hdurl: 'javascript:alert(1)' };
    mockFetchResponse([noHdurl, badProtocol, imageEntry]);

    const image = await getLatestApodImage();
    expect(image?.title).toBe(imageEntry.title);
  });

  it('skips malformed entries', async () => {
    mockFetchResponse([null, 'text', { ...imageEntry, title: '' }, imageEntry]);

    const image = await getLatestApodImage();
    expect(image?.title).toBe(imageEntry.title);
  });

  it('returns null alt when the entry has no alternative text', async () => {
    mockFetchResponse([{ ...imageEntry, alt: '' }]);

    const image = await getLatestApodImage();
    expect(image?.alt).toBeNull();
  });

  it('returns null when every entry is a video', async () => {
    mockFetchResponse([videoEntry, { ...videoEntry, date: '2026-10-15' }]);

    await expect(getLatestApodImage()).resolves.toBeNull();
  });

  it('returns null for an empty list', async () => {
    mockFetchResponse([]);

    await expect(getLatestApodImage()).resolves.toBeNull();
  });

  it('throws an invalid-response ApiError when the body is not a list', async () => {
    mockFetchResponse(imageEntry);

    const error = await getLatestApodImage().catch((caught: unknown) => caught);
    expect(isApiError(error) && error.kind).toBe('invalid-response');
  });

  it.each([404, 500])('propagates an http ApiError (%i) without the key', async (status) => {
    mockFetchResponse({ message: 'error' }, status);

    const error = await getLatestApodImage().catch((caught: unknown) => caught);
    expect(isApiError(error) && error.status).toBe(status);
    expect(String(error)).not.toContain(API_KEY);
  });

  it('throws a ConfigError and makes no request when NASA_API_KEY is missing', async () => {
    vi.stubEnv('NASA_API_KEY', '');
    const fetchMock = mockFetchResponse([imageEntry]);

    const error = await getLatestApodImage().catch((caught: unknown) => caught);
    expect(isConfigError(error)).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
