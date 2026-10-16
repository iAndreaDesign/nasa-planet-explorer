import { getNasaApiKey } from '@/lib/config/env';
import { toPlainText } from '@/lib/format/html';
import { ApiError, fetchJson } from '@/lib/http/fetchJson';
import type { ApodApiEntry, ApodImage } from './types';

export const APOD_ENDPOINT = 'https://science.nasa.gov/wp-json/wp/v2/apod-basic';
const REVALIDATE_SECONDS = 60 * 60;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toHttpUrl(value: unknown): string | null {
  if (typeof value !== 'string' || value.trim() === '') return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

function toNonEmptyText(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const text = toPlainText(value);
  return text === '' ? null : text;
}

function toApodImage(entry: ApodApiEntry): ApodImage | null {
  if (entry.media_type !== 'image') return null;

  const imageUrl = toHttpUrl(entry.hdurl);
  const title = toNonEmptyText(entry.title);
  if (imageUrl === null || title === null) return null;

  return {
    title,
    imageUrl,
    alt: toNonEmptyText(entry.alt),
    date: typeof entry.date === 'string' ? entry.date : null,
  };
}

/**
 * Latest APOD entry that is an image (videos and entries without `hdurl` are skipped).
 * Returns `null` when the list contains no usable image.
 * @throws ConfigError when `NASA_API_KEY` is missing (no request is made).
 * @throws ApiError when the request fails or the response is not a list.
 */
export async function getLatestApodImage(): Promise<ApodImage | null> {
  const url = new URL(APOD_ENDPOINT);
  url.searchParams.set('api_key', getNasaApiKey());

  const data = await fetchJson(url, { revalidate: REVALIDATE_SECONDS });
  if (!Array.isArray(data)) {
    throw new ApiError('invalid-response', url);
  }

  for (const entry of data) {
    if (!isRecord(entry)) continue;
    const image = toApodImage(entry);
    if (image) return image;
  }
  return null;
}
