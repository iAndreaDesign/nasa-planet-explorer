import type { StaticImageData } from 'next/image';
import planetBlue from '../../../planets/blue.png';
import earth from '../../../planets/earth.png';
import jupiter from '../../../planets/Jupiter.png';
import mars from '../../../planets/mars.png';
import mercury from '../../../planets/Mercury.png';
import neptune from '../../../planets/Neptune.png';
import planetHot from '../../../planets/Planet hot.png';
import saturn from '../../../planets/Saturn.png';
import planetTerrarium from '../../../planets/terrarium.png';
import uranus from '../../../planets/Uranus.png';
import venus from '../../../planets/venus.png';

/**
 * Illustrative images from `planets/` (decision D6, improved in T09; T15 may replace them).
 * Solar System planets use their own image, keyed by English-name slug.
 */
const PLANET_IMAGES: Readonly<Record<string, StaticImageData>> = {
  mercury,
  venus,
  earth,
  mars,
  jupiter,
  saturn,
  uranus,
  neptune,
};

/** Generic artist-impression images, rotated for exoplanets and unknown planets. */
export const GENERIC_IMAGES: readonly StaticImageData[] = [planetBlue, planetHot, planetTerrarium];

function genericImage(index: number): StaticImageData {
  const safeIndex = Number.isInteger(index) && index >= 0 ? index : 0;
  return GENERIC_IMAGES[safeIndex % GENERIC_IMAGES.length] ?? planetBlue;
}

export function getPlanetImage(slug: string, index: number): StaticImageData {
  return PLANET_IMAGES[slug] ?? genericImage(index);
}

/** Deterministic: the same position in the list always gets the same image. */
export function getExoplanetImage(index: number): StaticImageData {
  return genericImage(index);
}
