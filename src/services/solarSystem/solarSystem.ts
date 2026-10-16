import { getSolarSystemToken } from '@/lib/config/env';
import { ApiError, fetchJson } from '@/lib/http/fetchJson';
import { isRecord, isValidBodyId, orderPlanets, SOLAR_SYSTEM_API_HOST, toMoon, toUnorderedPlanet } from './mappers';
import type { Moon, Planet } from './types';

const BODIES_ENDPOINT = `https://${SOLAR_SYSTEM_API_HOST}/rest/bodies`;
const REVALIDATE_SECONDS = 60 * 60 * 24;

function requestBodies(url: URL): Promise<unknown> {
  return fetchJson(url, {
    headers: { Authorization: `Bearer ${getSolarSystemToken()}` },
    revalidate: REVALIDATE_SECONDS,
  });
}

/**
 * The eight planets ordered by distance from the Sun (`semimajorAxis`), with positions 1–8.
 * @throws ConfigError when `SOLAR_SYSTEM_API_TOKEN` is missing (no request is made).
 * @throws ApiError when the request fails or the response has no `bodies` list.
 */
export async function getPlanets(): Promise<Planet[]> {
  const url = new URL(`${BODIES_ENDPOINT}/`);
  url.searchParams.append('filter[]', 'isPlanet,eq,true');

  const data = await requestBodies(url);
  if (!isRecord(data) || !Array.isArray(data.bodies)) {
    throw new ApiError('invalid-response', url);
  }

  const planets = data.bodies.filter(isRecord).flatMap((body) => {
    const planet = toUnorderedPlanet(body);
    return planet === null ? [] : [planet];
  });
  return orderPlanets(planets);
}

/** Planet by URL slug (e.g. "earth"), or `null` when it is not one of the planets. */
export async function getPlanetBySlug(slug: string): Promise<Planet | null> {
  const planets = await getPlanets();
  return planets.find((planet) => planet.slug === slug) ?? null;
}

/**
 * Moon data by API body id (from the moon's `rel`). Used by the moons proxy route.
 * @throws RangeError when the id is not a valid API body id (no request is made).
 * @throws ConfigError | ApiError as {@link getPlanets}.
 */
export async function getMoon(id: string): Promise<Moon> {
  if (!isValidBodyId(id)) {
    throw new RangeError('Invalid body id');
  }

  const url = new URL(`${BODIES_ENDPOINT}/${encodeURIComponent(id)}`);
  const data = await requestBodies(url);
  if (!isRecord(data)) {
    throw new ApiError('invalid-response', url);
  }
  return toMoon(data, id);
}
