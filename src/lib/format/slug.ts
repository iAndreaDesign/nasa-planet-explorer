/** URL-safe, deterministic slug: "GJ 1214 b" → "gj-1214-b", "Kepler-186 f" → "kepler-186-f". */
export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Slugs for a list of names, in the same order. Colliding slugs get a numeric suffix
 * ("-2", "-3", …) by order of appearance; empty slugs fall back to "item".
 */
export function createUniqueSlugs(names: readonly string[]): string[] {
  const used = new Set<string>();

  return names.map((name) => {
    const base = slugify(name) || 'item';
    let slug = base;
    for (let suffix = 2; used.has(slug); suffix += 1) {
      slug = `${base}-${suffix}`;
    }
    used.add(slug);
    return slug;
  });
}
