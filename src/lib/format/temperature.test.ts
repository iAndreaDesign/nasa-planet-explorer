import { classifyTemperature } from './temperature';

describe('classifyTemperature', () => {
  it.each([
    [72, 'cold'],
    [210, 'cold'],
    [269.99, 'cold'],
    [270, null],
    [288, null],
    [323, null],
    [323.01, 'hot'],
    [440, 'hot'],
    [737, 'hot'],
  ])('classifies %s K as %s', (kelvin, expected) => {
    expect(classifyTemperature(kelvin)).toBe(expected);
  });

  it.each([null, undefined, Number.NaN, '210'])('returns null without a numeric temperature (%j)', (value) => {
    expect(classifyTemperature(value)).toBeNull();
  });
});
