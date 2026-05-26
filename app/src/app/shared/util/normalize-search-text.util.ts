// Search text lowercase and accent-insensitive.
export function normalizeSearchText(...values: string[]): string {
  return values
    .join(' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
