import { formatNumber, toFiniteNumber } from './number';

describe('toFiniteNumber', () => {
  it.each([0, -5832.5, 3.71, 1e30])('keeps finite numbers (%s)', (value) => {
    expect(toFiniteNumber(value)).toBe(value);
  });

  it.each([null, undefined, Number.NaN, Number.POSITIVE_INFINITY, '3.71', '', {}, true])(
    'returns null for %j',
    (value) => {
      expect(toFiniteNumber(value)).toBeNull();
    },
  );
});

describe('formatNumber', () => {
  it('uses the decimal separator of the locale', () => {
    expect(formatNumber(3.71, 'en')).toBe('3.71');
    expect(formatNumber(3.71, 'es')).toBe('3,71');
  });

  it('uses the thousands separator of the locale', () => {
    expect(formatNumber(227939200, 'en')).toBe('227,939,200');
    expect(formatNumber(227939200, 'es')).toBe('227.939.200');
  });

  it('follows CLDR grouping: Spanish does not group four-digit numbers', () => {
    expect(formatNumber(6779, 'en')).toBe('6,779');
    expect(formatNumber(6779, 'es')).toBe('6779');
    expect(formatNumber(12345, 'es')).toBe('12.345');
  });

  it('rounds to two fraction digits by default', () => {
    expect(formatNumber(1.58040453, 'en')).toBe('1.58');
  });

  it('accepts custom fraction digits', () => {
    expect(formatNumber(14.6427, 'en', { maximumFractionDigits: 1 })).toBe('14.6');
    expect(formatNumber(2, 'en', { minimumFractionDigits: 2 })).toBe('2.00');
  });

  it('formats zero and negative values', () => {
    expect(formatNumber(0, 'en')).toBe('0');
    expect(formatNumber(-5832.5, 'en')).toBe('-5,832.5');
  });

  it.each([null, undefined, Number.NaN, 'abc'])('returns null for missing value %j', (value) => {
    expect(formatNumber(value, 'en')).toBeNull();
  });
});
