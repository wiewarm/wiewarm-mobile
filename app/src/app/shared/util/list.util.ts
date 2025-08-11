export function filterItems<T extends Record<string, unknown>>(
  items: T[],
  term: string,
  fields: (keyof T)[]
): T[] {
  if (!term) return items;
  const q = term.toLowerCase();
  return items.filter((it) =>
    fields.some((f) =>
      String(it[f] ?? '')
        .toLowerCase()
        .includes(q)
    )
  );
}

export function sortItems<T>(
  items: T[],
  field: keyof T,
  dir: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;

    let cmp: number;
    if (av instanceof Date && bv instanceof Date) {
      cmp = av.getTime() - bv.getTime();
    } else if (typeof av === 'number' && typeof bv === 'number') {
      cmp = av - bv;
    } else {
      cmp = String(av).localeCompare(String(bv), undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    }
    return dir === 'asc' ? cmp : -cmp;
  });
}
