// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(__dirname, '..');

function scssFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return scssFiles(path);
    return entry.name.endsWith('.scss') ? [path] : [];
  });
}

const typographyScale = readFileSync(join(SRC, 'styles', '_typography.scss'), 'utf8');

describe('typography (CLAUDE.md §4: rem only, minimum 1rem)', () => {
  const declarations = scssFiles(SRC).flatMap((file) =>
    [...readFileSync(file, 'utf8').matchAll(/font-size:\s*([^;]+);/g)].map((match) => ({
      file: file.slice(SRC.length + 1),
      value: (match[1] ?? '').trim(),
    })),
  );

  it('finds font-size declarations to check', () => {
    expect(declarations.length).toBeGreaterThan(0);
  });

  it.each(declarations)('$file uses rem or the type scale ($value)', ({ value }) => {
    expect(value).not.toMatch(/\d(px|pt|em)\b/);
    expect(value).toMatch(/^(type\.\$font-size-[a-z0-9-]+|\$font-size-[a-z0-9-]+|[\d.]+rem)$/);
  });

  it('never defines a scale step below 1rem', () => {
    const sizes = [...typographyScale.matchAll(/\$font-size-[a-z0-9-]+:\s*([^;]+);/g)].map((match) => match[1] ?? '');
    const remValues = sizes.flatMap((size) => [...size.matchAll(/([\d.]+)rem/g)].map((match) => Number(match[1])));

    expect(remValues.length).toBeGreaterThan(0);
    expect(Math.min(...remValues)).toBeGreaterThanOrEqual(1);
  });
});

describe('colour tokens (WCAG AA contrast)', () => {
  const tokens = readFileSync(join(SRC, 'styles', '_tokens.scss'), 'utf8');
  const color = (name: string): string => {
    const match = new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`, 'i').exec(tokens);
    if (!match?.[1]) throw new Error(`Missing token --color-${name}`);
    return match[1];
  };

  const luminance = (hex: string) => {
    const channels = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255);
    const [r = 0, g = 0, b = 0] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a: string, b: string) => {
    const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
    return (light + 0.05) / (dark + 0.05);
  };

  it.each([
    ['text', 'background'],
    ['text-muted', 'background'],
    ['text-accent', 'background'],
    ['text', 'surface'],
    ['text-muted', 'surface'],
    ['text-muted', 'surface-raised'],
    ['text-accent', 'surface'],
    ['text', 'primary'],
    ['text', 'surface-sunken'],
    ['text-muted', 'surface-sunken'],
  ])('--color-%s on --color-%s reaches 4.5:1', (foreground, background) => {
    expect(contrast(color(foreground), color(background))).toBeGreaterThanOrEqual(4.5);
  });
});
