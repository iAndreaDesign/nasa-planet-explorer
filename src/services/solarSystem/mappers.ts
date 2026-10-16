import { toFiniteNumber } from '@/lib/format/number';
import { slugify } from '@/lib/format/slug';
import type { Moon, MoonRef, Planet, ScientificValue, SolarSystemApiBody } from './types';

export const SOLAR_SYSTEM_API_HOST = 'api.le-systeme-solaire.net';
const BODIES_PATH = /^\/rest\/bodies\/([^/]+)\/?$/;
const BODY_ID = /^[a-z0-9-]{1,64}$/;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** API ids are lowercase alphanumerics and hyphens; anything else is rejected (proxy input, SSRF). */
export function isValidBodyId(id: string): boolean {
  return BODY_ID.test(id);
}

/** Extracts the body id from a moon `rel` URL, only for `https://api.le-systeme-solaire.net/rest/bodies/<id>`. */
export function bodyIdFromRel(rel: unknown): string | null {
  if (typeof rel !== 'string') return null;
  try {
    const url = new URL(rel);
    const match = BODIES_PATH.exec(url.pathname);
    const id = match?.[1]?.toLowerCase() ?? null;
    if (url.protocol !== 'https:' || url.hostname !== SOLAR_SYSTEM_API_HOST || id === null) return null;
    return isValidBodyId(id) ? id : null;
  } catch {
    return null;
  }
}

/**
 * The API reports unknown measurements as 0. For quantities that cannot physically be 0
 * (mass, radius, density, gravity, temperature, periods, distances) 0 is treated as missing.
 * Negative values are kept (e.g. Venus' retrograde rotation).
 */
function toKnownMeasurement(value: unknown): number | null {
  const number = toFiniteNumber(value);
  return number === null || number === 0 ? null : number;
}

function toText(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
}

function toMass(value: unknown): ScientificValue | null {
  if (!isRecord(value)) return null;
  const mantissa = toKnownMeasurement(value.massValue);
  const exponent = toFiniteNumber(value.massExponent);
  return mantissa === null || exponent === null || !Number.isInteger(exponent)
    ? null
    : { value: mantissa, exponent };
}

function toMoonRefs(value: unknown): MoonRef[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isRecord).flatMap((moon) => {
    const name = toText(moon.moon);
    return name === null ? [] : [{ name, id: bodyIdFromRel(moon.rel) }];
  });
}

function bodyName(body: SolarSystemApiBody): string | null {
  return toText(body.englishName) ?? toText(body.name);
}

/** Maps a raw body without position; `null` when it has no usable id or name. */
export function toUnorderedPlanet(body: SolarSystemApiBody): Omit<Planet, 'position'> | null {
  const id = toText(body.id);
  const name = bodyName(body);
  if (id === null || name === null) return null;

  return {
    id,
    slug: slugify(name) || id,
    name,
    bodyType: toText(body.bodyType),
    moons: toMoonRefs(body.moons),
    mass: toMass(body.mass),
    meanRadius: toKnownMeasurement(body.meanRadius),
    density: toKnownMeasurement(body.density),
    gravity: toKnownMeasurement(body.gravity),
    escape: toKnownMeasurement(body.escape),
    axialTilt: toFiniteNumber(body.axialTilt),
    semimajorAxis: toKnownMeasurement(body.semimajorAxis),
    sideralOrbit: toKnownMeasurement(body.sideralOrbit),
    sideralRotation: toKnownMeasurement(body.sideralRotation),
    avgTemp: toKnownMeasurement(body.avgTemp),
  };
}

/** Orders by `semimajorAxis` ascending (unknown distances last) and assigns 1-based positions. */
export function orderPlanets(planets: Omit<Planet, 'position'>[]): Planet[] {
  return [...planets]
    .sort((a, b) => (a.semimajorAxis ?? Number.POSITIVE_INFINITY) - (b.semimajorAxis ?? Number.POSITIVE_INFINITY))
    .map((planet, index) => ({ ...planet, position: index + 1 }));
}

export function toMoon(body: SolarSystemApiBody, requestedId: string): Moon {
  return {
    id: requestedId,
    name: bodyName(body) ?? requestedId,
    meanRadius: toKnownMeasurement(body.meanRadius),
    mass: toMass(body.mass),
    density: toKnownMeasurement(body.density),
    gravity: toKnownMeasurement(body.gravity),
  };
}
