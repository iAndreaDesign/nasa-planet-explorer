import { getAdjacent } from './adjacent';

const planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];

describe('getAdjacent', () => {
  it('returns the neighbours of a middle item', () => {
    expect(getAdjacent(planets, 2)).toEqual({ previous: 'Venus', next: 'Mars' });
  });

  it('wraps from the first item to the last one', () => {
    expect(getAdjacent(planets, 0)).toEqual({ previous: 'Neptune', next: 'Venus' });
  });

  it('wraps from the last item to the first one', () => {
    expect(getAdjacent(planets, planets.length - 1)).toEqual({ previous: 'Uranus', next: 'Mercury' });
  });

  it('returns the same item for both sides in a single-item list', () => {
    expect(getAdjacent(['Only'], 0)).toEqual({ previous: 'Only', next: 'Only' });
  });

  it('handles two-item lists', () => {
    expect(getAdjacent(['A', 'B'], 0)).toEqual({ previous: 'B', next: 'B' });
  });

  it.each([-1, 8, 1.5, Number.NaN])('returns null for out-of-range index %s', (index) => {
    expect(getAdjacent(planets, index)).toBeNull();
  });

  it('returns null for an empty list', () => {
    expect(getAdjacent([], 0)).toBeNull();
  });
});
