import { createUniqueSlugs, slugify } from './slug';

describe('slugify', () => {
  it.each([
    ['GJ 1214 b', 'gj-1214-b'],
    ['Kepler-186 f', 'kepler-186-f'],
    ['TRAPPIST-1 e', 'trappist-1-e'],
    ['55 Cnc e', '55-cnc-e'],
    ['HD 189733 b', 'hd-189733-b'],
    ['  Proxima   Cen b  ', 'proxima-cen-b'],
    ['TOI-700 d (candidate)', 'toi-700-d-candidate'],
    ['Gliese 581 g', 'gliese-581-g'],
    ['Ñandú Prime b', 'nandu-prime-b'],
    ['2MASS J1207+3932 b', '2mass-j1207-3932-b'],
  ])('slugifies %j as %j', (name, expected) => {
    expect(slugify(name)).toBe(expected);
  });

  it('is deterministic', () => {
    expect(slugify('GJ 1214 b')).toBe(slugify('GJ 1214 b'));
  });

  it('returns an empty string when nothing URL-safe remains', () => {
    expect(slugify('')).toBe('');
    expect(slugify('***')).toBe('');
  });
});

describe('createUniqueSlugs', () => {
  it('keeps the input order', () => {
    expect(createUniqueSlugs(['GJ 1214 b', 'Kepler-186 f'])).toEqual(['gj-1214-b', 'kepler-186-f']);
  });

  it('disambiguates colliding slugs by order of appearance', () => {
    expect(createUniqueSlugs(['A b', 'A-b', 'a  b'])).toEqual(['a-b', 'a-b-2', 'a-b-3']);
  });

  it('does not collide with a name that already ends in a suffix', () => {
    expect(createUniqueSlugs(['A b 2', 'A b', 'A-b'])).toEqual(['a-b-2', 'a-b', 'a-b-3']);
  });

  it('falls back to "item" for names without URL-safe characters', () => {
    expect(createUniqueSlugs(['***', '!!!'])).toEqual(['item', 'item-2']);
  });

  it('returns an empty list for no names', () => {
    expect(createUniqueSlugs([])).toEqual([]);
  });
});
