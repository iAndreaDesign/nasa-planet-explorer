import { GENERIC_IMAGES, getExoplanetImage, getPlanetImage } from './celestialImages';

const PLANET_SLUGS = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

describe('getPlanetImage', () => {
  it('gives each Solar System planet its own image', () => {
    const images = PLANET_SLUGS.map((slug, index) => getPlanetImage(slug, index));

    expect(new Set(images).size).toBe(8);
    for (const image of images) expect(GENERIC_IMAGES).not.toContain(image);
  });

  it('falls back to a generic image for an unknown slug', () => {
    expect(GENERIC_IMAGES).toContain(getPlanetImage('pluto', 0));
  });
});

describe('getExoplanetImage', () => {
  it('rotates the generic images deterministically', () => {
    const images = Array.from({ length: 10 }, (_, index) => getExoplanetImage(index));

    expect(images[0]).toBe(GENERIC_IMAGES[0]);
    expect(images[1]).toBe(GENERIC_IMAGES[1]);
    expect(images[2]).toBe(GENERIC_IMAGES[2]);
    expect(images[3]).toBe(GENERIC_IMAGES[0]);
    expect(getExoplanetImage(7)).toBe(images[7]);
  });

  it.each([-1, 1.5, Number.NaN])('uses the first generic image for invalid index %s', (index) => {
    expect(getExoplanetImage(index)).toBe(GENERIC_IMAGES[0]);
  });
});
