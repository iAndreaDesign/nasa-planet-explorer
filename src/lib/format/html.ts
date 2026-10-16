const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function decodeCodePoint(codePoint: number, fallback: string): string {
  return Number.isInteger(codePoint) && codePoint > 0 && codePoint <= 0x10ffff
    ? String.fromCodePoint(codePoint)
    : fallback;
}

/**
 * Converts an API text field that may contain HTML (e.g. APOD `alt`: "the sky&#039;s horizon")
 * into plain text: strips tags, decodes entities and collapses whitespace.
 */
export function toPlainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, body: string) => {
      if (body[0] === '#') {
        const isHex = body[1]?.toLowerCase() === 'x';
        return decodeCodePoint(Number.parseInt(body.slice(isHex ? 2 : 1), isHex ? 16 : 10), entity);
      }
      return NAMED_ENTITIES[body.toLowerCase()] ?? entity;
    })
    .replace(/\s+/g, ' ')
    .trim();
}
