export function filterItems<T>(items: T[], term: string, columns: (keyof T)[]): T[] {
  if (!term) return items;
  const lowerTerm = term.toLowerCase();
  return items.filter((item) => {
    return columns.some((key) => {
      const value = item[key];
      return value != null && value.toString().toLowerCase().includes(lowerTerm);
    });
  });
}

export function sortItems<T>(items: T[], sortField: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...items].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    // Null/undefined Handling
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    // Zahlenvergleich
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    }

    // Stringvergleich (Fallback)
    return direction === 'asc'
      ? aVal.toString().localeCompare(bVal.toString(), undefined, { numeric: true, sensitivity: 'base' })
      : bVal.toString().localeCompare(aVal.toString(), undefined, { numeric: true, sensitivity: 'base' });
  });
}
