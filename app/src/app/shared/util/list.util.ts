export function filterItems<T extends { [k: string]: any }>(
  items: T[],
  term: string,
  fields: (keyof T)[]
) {
  if (!term) return items;
  const q = term.toLowerCase();
  return items.filter((it) =>
    fields.some((f) =>
      ((it[f] ?? '') as any).toString().toLowerCase().includes(q)
    )
  );
}

export function sortItems<T>(
  items: T[],
  field: keyof T,
  dir: 'asc' | 'desc' = 'asc'
) {
  const arr = [...items];
  arr.sort((a, b) => {
    const av = a[field],
      bv = b[field];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    const cmp = String(av).localeCompare(String(bv), undefined, {
      numeric: true,
      sensitivity: 'base',
    });
    return dir === 'asc' ? cmp : -cmp;
  });
  return arr;
}
