/** Formats a 1-based list position with two digits ("04"), as shown on planet cards. */
export function formatPosition(position: number): string {
  if (!Number.isInteger(position) || position < 1) {
    throw new RangeError(`Position must be a positive integer, received ${position}`);
  }

  return String(position).padStart(2, '0');
}
