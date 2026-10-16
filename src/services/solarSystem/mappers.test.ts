import { MARS, UNORDERED_PLANETS } from './fixtures';
import { bodyIdFromRel, isValidBodyId, orderPlanets, toMoon, toUnorderedPlanet } from './mappers';

describe('bodyIdFromRel', () => {
  it('extracts the id from a Solar System API rel URL', () => {
    expect(bodyIdFromRel('https://api.le-systeme-solaire.net/rest/bodies/phobos')).toBe('phobos');
    expect(bodyIdFromRel('https://api.le-systeme-solaire.net/rest/bodies/Deimos/')).toBe('deimos');
  });

  it.each([
    ['other host', 'https://evil.example.com/rest/bodies/phobos'],
    ['http protocol', 'http://api.le-systeme-solaire.net/rest/bodies/phobos'],
    ['other path', 'https://api.le-systeme-solaire.net/rest/other/phobos'],
    ['nested path', 'https://api.le-systeme-solaire.net/rest/bodies/phobos/extra'],
    ['invalid characters', 'https://api.le-systeme-solaire.net/rest/bodies/pho%2Fbos'],
    ['not a URL', 'phobos'],
  ])('rejects %s', (_, rel) => {
    expect(bodyIdFromRel(rel)).toBeNull();
  });

  it.each([null, undefined, 42])('rejects non-string value %j', (rel) => {
    expect(bodyIdFromRel(rel)).toBeNull();
  });
});

describe('isValidBodyId', () => {
  it.each(['phobos', 's2004s12', 'lune', 'a-b'])('accepts %s', (id) => {
    expect(isValidBodyId(id)).toBe(true);
  });

  it.each(['', 'Phobos', '../secret', 'pho bos', 'a/b', 'x'.repeat(65)])('rejects %j', (id) => {
    expect(isValidBodyId(id)).toBe(false);
  });
});

describe('toUnorderedPlanet', () => {
  it('maps every specified field of Mars', () => {
    expect(toUnorderedPlanet(MARS)).toEqual({
      id: 'mars',
      slug: 'mars',
      name: 'Mars',
      bodyType: 'Planet',
      moons: [
        { name: 'Phobos', id: 'phobos' },
        { name: 'Deïmos', id: 'deimos' },
      ],
      mass: { value: 6.41712, exponent: 23 },
      meanRadius: 3389.5,
      density: 3.9341,
      gravity: 3.71,
      escape: 5030,
      axialTilt: 25.19,
      semimajorAxis: 227939200,
      sideralOrbit: 686.98,
      sideralRotation: 24.6229,
      avgTemp: 210,
    });
  });

  it('uses the English name for the slug, not the French API id', () => {
    const earth = toUnorderedPlanet({ ...MARS, id: 'terre', englishName: 'Earth' });
    expect(earth?.id).toBe('terre');
    expect(earth?.slug).toBe('earth');
  });

  it('treats null, missing and 0 measurements as missing', () => {
    const planet = toUnorderedPlanet({
      id: 'x',
      englishName: 'X',
      mass: null,
      meanRadius: 0,
      density: undefined,
      gravity: 'n/a',
      avgTemp: 0,
    });

    expect(planet).toMatchObject({
      mass: null,
      meanRadius: null,
      density: null,
      gravity: null,
      escape: null,
      avgTemp: null,
      bodyType: null,
    });
  });

  it('keeps a 0° axial tilt and a negative (retrograde) rotation', () => {
    const planet = toUnorderedPlanet({ ...MARS, axialTilt: 0, sideralRotation: -5832.5 });
    expect(planet?.axialTilt).toBe(0);
    expect(planet?.sideralRotation).toBe(-5832.5);
  });

  it('rejects masses with a zero value or a non-integer exponent', () => {
    expect(toUnorderedPlanet({ ...MARS, mass: { massValue: 0, massExponent: 23 } })?.mass).toBeNull();
    expect(toUnorderedPlanet({ ...MARS, mass: { massValue: 6.4, massExponent: 2.5 } })?.mass).toBeNull();
  });

  it.each([null, [], 'none'])('returns no moons for moons = %j', (moons) => {
    expect(toUnorderedPlanet({ ...MARS, moons })?.moons).toEqual([]);
  });

  it('keeps moons with an invalid rel with a null id and drops entries without a name', () => {
    const planet = toUnorderedPlanet({
      ...MARS,
      moons: [{ moon: 'Odd', rel: 'https://evil.example.com/x' }, { rel: 'https://api.le-systeme-solaire.net/rest/bodies/a' }, null],
    });
    expect(planet?.moons).toEqual([{ name: 'Odd', id: null }]);
  });

  it('falls back to name when englishName is missing', () => {
    expect(toUnorderedPlanet({ ...MARS, englishName: '', name: 'Mars FR' })?.name).toBe('Mars FR');
  });

  it('returns null without an id or a name', () => {
    expect(toUnorderedPlanet({ ...MARS, id: undefined })).toBeNull();
    expect(toUnorderedPlanet({ ...MARS, englishName: undefined, name: undefined })).toBeNull();
  });
});

describe('orderPlanets', () => {
  it('orders by semimajorAxis and assigns positions 1–8', () => {
    const planets = UNORDERED_PLANETS.map(toUnorderedPlanet).filter((planet) => planet !== null);

    const ordered = orderPlanets(planets);
    expect(ordered.map((planet) => `${planet.position} ${planet.name}`)).toEqual([
      '1 Mercury',
      '2 Venus',
      '3 Earth',
      '4 Mars',
      '5 Jupiter',
      '6 Saturn',
      '7 Uranus',
      '8 Neptune',
    ]);
  });

  it('places planets without a known distance last', () => {
    const mars = toUnorderedPlanet(MARS);
    const unknown = toUnorderedPlanet({ ...MARS, id: 'x', englishName: 'X', semimajorAxis: null });
    if (!mars || !unknown) throw new Error('fixture');

    expect(orderPlanets([unknown, mars]).map((planet) => planet.name)).toEqual(['Mars', 'X']);
  });
});

describe('toMoon', () => {
  it('maps the moon fields and treats 0 values as missing', () => {
    expect(
      toMoon({ englishName: 'Deimos', meanRadius: 6.2, mass: { massValue: 1.4762, massExponent: 15 }, density: 0, gravity: 0 }, 'deimos'),
    ).toEqual({
      id: 'deimos',
      name: 'Deimos',
      meanRadius: 6.2,
      mass: { value: 1.4762, exponent: 15 },
      density: null,
      gravity: null,
    });
  });

  it('falls back to the requested id as name', () => {
    expect(toMoon({}, 's2004s12').name).toBe('s2004s12');
  });
});
