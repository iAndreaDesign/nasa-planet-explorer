import { formatPosition } from './position';

describe('formatPosition', () => {
  it.each([
    [1, '01'],
    [4, '04'],
    [8, '08'],
    [10, '10'],
    [123, '123'],
  ])('formats %i as %s', (position, expected) => {
    expect(formatPosition(position)).toBe(expected);
  });

  it.each([0, -1, 1.5, Number.NaN])('rejects invalid position %s', (position) => {
    expect(() => formatPosition(position)).toThrow(RangeError);
  });
});
