import { formatScientific, toSuperscript } from './scientific';

describe('toSuperscript', () => {
  it('converts digits and the minus sign', () => {
    expect(toSuperscript(23)).toBe('²³');
    expect(toSuperscript(-7)).toBe('⁻⁷');
    expect(toSuperscript(1024)).toBe('¹⁰²⁴');
  });
});

describe('formatScientific', () => {
  it('formats the Mars mass from the API fields', () => {
    expect(formatScientific(6.41712, 23, 'en')).toBe('6.42 × 10²³');
  });

  it('uses the locale decimal separator', () => {
    expect(formatScientific(6.41712, 23, 'es')).toBe('6,42 × 10²³');
  });

  it('normalises mantissas outside [1, 10)', () => {
    expect(formatScientific(641.712, 21, 'en')).toBe('6.42 × 10²³');
    expect(formatScientific(0.0641712, 25, 'en')).toBe('6.42 × 10²³');
  });

  it('carries the exponent when rounding reaches 10', () => {
    expect(formatScientific(9.999, 23, 'en')).toBe('1 × 10²⁴');
  });

  it('supports negative exponents and negative mantissas', () => {
    expect(formatScientific(1.5, -3, 'en')).toBe('1.5 × 10⁻³');
    expect(formatScientific(-2.5, 4, 'en')).toBe('-2.5 × 10⁴');
  });

  it('omits the power of ten when the exponent is zero', () => {
    expect(formatScientific(3.5, 0, 'en')).toBe('3.5');
    expect(formatScientific(0, 23, 'en')).toBe('0');
  });

  it.each([
    [null, 23],
    [6.4, null],
    [undefined, undefined],
    [Number.NaN, 23],
    [6.4, 2.5],
  ])('returns null for mantissa %j and exponent %j', (mantissa, exponent) => {
    expect(formatScientific(mantissa, exponent, 'en')).toBeNull();
  });
});
