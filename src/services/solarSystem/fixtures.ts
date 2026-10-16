import type { SolarSystemApiBody } from './types';

const rel = (id: string) => `https://api.le-systeme-solaire.net/rest/bodies/${id}`;

function planet(
  id: string,
  englishName: string,
  semimajorAxis: number,
  extra: Partial<SolarSystemApiBody> = {},
): SolarSystemApiBody {
  return {
    id,
    name: id,
    englishName,
    bodyType: 'Planet',
    moons: null,
    mass: { massValue: 1, massExponent: 24 },
    meanRadius: 1000,
    density: 1,
    gravity: 1,
    escape: 1000,
    axialTilt: 1,
    semimajorAxis,
    sideralOrbit: 100,
    sideralRotation: 10,
    avgTemp: 100,
    ...extra,
  };
}

export const MARS: SolarSystemApiBody = planet('mars', 'Mars', 227939200, {
  moons: [
    { moon: 'Phobos', rel: rel('phobos') },
    { moon: 'Deïmos', rel: rel('deimos') },
  ],
  mass: { massValue: 6.41712, massExponent: 23 },
  meanRadius: 3389.5,
  density: 3.9341,
  gravity: 3.71,
  escape: 5030,
  axialTilt: 25.19,
  sideralOrbit: 686.98,
  sideralRotation: 24.6229,
  avgTemp: 210,
});

/** The eight planets in a deliberately unordered sequence. */
export const UNORDERED_PLANETS: SolarSystemApiBody[] = [
  planet('neptune', 'Neptune', 4498396441),
  MARS,
  planet('terre', 'Earth', 149598023, { moons: [{ moon: 'La Lune', rel: rel('lune') }] }),
  planet('mercure', 'Mercury', 57909227),
  planet('jupiter', 'Jupiter', 778340821),
  planet('venus', 'Venus', 108208475, { sideralRotation: -5832.5, moons: [] }),
  planet('uranus', 'Uranus', 2870658186),
  planet('saturne', 'Saturn', 1426666422),
];

export const PHOBOS: SolarSystemApiBody = {
  id: 'phobos',
  name: 'Phobos',
  englishName: 'Phobos',
  bodyType: 'Moon',
  mass: { massValue: 1.06, massExponent: 16 },
  meanRadius: 11.1,
  density: 1.876,
  gravity: 0.0057,
};
