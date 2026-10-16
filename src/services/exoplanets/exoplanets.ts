import { getNasaApiKey } from '@/lib/config/env';
import { toFiniteNumber } from '@/lib/format/number';
import { createUniqueSlugs } from '@/lib/format/slug';
import { ApiError, fetchJson } from '@/lib/http/fetchJson';
import type { Exoplanet, ExoplanetApiRow } from './types';

export const EXOPLANET_ARCHIVE_ENDPOINT = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';
export const EXOPLANET_LIMIT = 10;
const REVALIDATE_SECONDS = 60 * 60 * 24;

const COLUMNS = [
  'pl_name',
  'hostname',
  'disc_year',
  'discoverymethod',
  'sy_dist',
  'pl_rade',
  'pl_bmasse',
  'pl_orbper',
  'pl_eqt',
  'pl_dens',
] as const;

/**
 * Latest discoveries first. The limit is applied with `maxrec` because this TAP service applies
 * `TOP` before `ORDER BY`, so `select top 10` would not return the latest discoveries.
 */
export const EXOPLANET_QUERY = `select ${COLUMNS.join(',')} from pscomppars where disc_year is not null order by disc_year desc,pl_name asc`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toText(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
}

function toYear(value: unknown): number | null {
  const year = toFiniteNumber(value);
  return year !== null && Number.isInteger(year) ? year : null;
}

function toExoplanet(row: ExoplanetApiRow, name: string, slug: string): Exoplanet {
  return {
    slug,
    name,
    hostName: toText(row.hostname),
    discoveryYear: toYear(row.disc_year),
    discoveryMethod: toText(row.discoverymethod),
    distance: toFiniteNumber(row.sy_dist),
    radius: toFiniteNumber(row.pl_rade),
    mass: toFiniteNumber(row.pl_bmasse),
    orbitalPeriod: toFiniteNumber(row.pl_orbper),
    equilibriumTemperature: toFiniteNumber(row.pl_eqt),
    density: toFiniteNumber(row.pl_dens),
  };
}

/**
 * The 10 most recently discovered exoplanets, in query order, each with a unique slug.
 * @throws ConfigError when `NASA_API_KEY` is missing (no request is made).
 * @throws ApiError when the request fails or the response is not a list.
 */
export async function getExoplanets(): Promise<Exoplanet[]> {
  const url = new URL(EXOPLANET_ARCHIVE_ENDPOINT);
  url.searchParams.set('api_key', getNasaApiKey());
  url.searchParams.set('query', EXOPLANET_QUERY);
  url.searchParams.set('format', 'json');
  url.searchParams.set('maxrec', String(EXOPLANET_LIMIT));

  const data = await fetchJson(url, { revalidate: REVALIDATE_SECONDS });
  if (!Array.isArray(data)) {
    throw new ApiError('invalid-response', url);
  }

  const rows = data
    .filter(isRecord)
    .flatMap((row: ExoplanetApiRow) => {
      const name = toText(row.pl_name);
      return name === null ? [] : [{ row, name }];
    })
    .slice(0, EXOPLANET_LIMIT);

  const slugs = createUniqueSlugs(rows.map(({ name }) => name));
  return rows.map(({ row, name }, index) => toExoplanet(row, name, slugs[index] ?? name));
}

/** Exoplanet of the current selection by slug, or `null` when it is not in it. */
export async function getExoplanetBySlug(slug: string): Promise<Exoplanet | null> {
  const exoplanets = await getExoplanets();
  return exoplanets.find((exoplanet) => exoplanet.slug === slug) ?? null;
}
