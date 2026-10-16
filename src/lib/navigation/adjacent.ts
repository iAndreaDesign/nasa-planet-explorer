export interface Adjacent<T> {
  previous: T;
  next: T;
}

/**
 * Previous and next items with wrap-around (spec `detail-navigation`):
 * the first item's previous is the last one and the last item's next is the first one.
 * Returns `null` when the list is empty or the index is out of range.
 */
export function getAdjacent<T>(items: readonly T[], index: number): Adjacent<T> | null {
  if (!Number.isInteger(index) || index < 0 || index >= items.length) return null;

  const previous = items[(index - 1 + items.length) % items.length];
  const next = items[(index + 1) % items.length];
  if (previous === undefined || next === undefined) return null;

  return { previous, next };
}
