import en from '../../messages/en.json';
import es from '../../messages/es.json';
import { routing } from './routing';

type Messages = { [key: string]: string | Messages };

function flatten(messages: Messages, prefix = ''): Record<string, string> {
  return Object.entries(messages).reduce<Record<string, string>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'string' ? { ...acc, [path]: value } : { ...acc, ...flatten(value, path) };
  }, {});
}

const catalogs: Record<string, Record<string, string>> = { en: flatten(en), es: flatten(es) };

describe('translation messages', () => {
  it('has a catalog for every supported locale', () => {
    expect(Object.keys(catalogs).sort()).toEqual([...routing.locales].sort());
  });

  it('en and es define exactly the same keys', () => {
    expect(Object.keys(catalogs.es ?? {}).sort()).toEqual(Object.keys(catalogs.en ?? {}).sort());
  });

  it.each(Object.keys(catalogs))('%s has no empty messages', (locale) => {
    const empty = Object.entries(catalogs[locale] ?? {}).filter(([, value]) => value.trim() === '');
    expect(empty).toEqual([]);
  });

  it('translates "Not available"', () => {
    expect(catalogs.en?.['common.notAvailable']).toBe('Not available');
    expect(catalogs.es?.['common.notAvailable']).toBe('No disponible');
  });
});
