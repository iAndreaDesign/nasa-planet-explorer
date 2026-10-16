import { toPlainText } from './html';

describe('toPlainText', () => {
  it('decodes numeric entities found in APOD alt texts', () => {
    expect(toPlainText('the sky&#039;s horizon')).toBe("the sky's horizon");
  });

  it('decodes hexadecimal and named entities', () => {
    expect(toPlainText('Smörgåsbord &#x2014; Saturn &amp; moons &quot;live&quot;')).toBe(
      'Smörgåsbord — Saturn & moons "live"',
    );
  });

  it('strips HTML tags', () => {
    expect(toPlainText('<a href="https://example.com">Eric Holland</a>')).toBe('Eric Holland');
  });

  it('collapses whitespace', () => {
    expect(toPlainText('Video of a rocket launch in dark,  predawn skies\n')).toBe(
      'Video of a rocket launch in dark, predawn skies',
    );
  });

  it('keeps unknown or invalid entities untouched', () => {
    expect(toPlainText('&unknown; &#0; &#xFFFFFFF;')).toBe('&unknown; &#0; &#xFFFFFFF;');
  });

  it('returns an empty string for empty input', () => {
    expect(toPlainText('')).toBe('');
  });
});
