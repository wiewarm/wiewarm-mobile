function parseDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  const clean = dateStr.replace(/\s+/, 'T');
  const d = new Date(clean);
  return isNaN(d.getTime()) ? null : d;
}

export function toTimestamp(
  primaryDate: string | null | undefined,
  fallbackDate: string | null | undefined,
): number {
  return (parseDate(primaryDate ?? fallbackDate ?? null))?.getTime() ?? 0;
}

export function isOlderThanOneMonth(dateStr: string | null): boolean {
  const itemDate = parseDate(dateStr);
  if (!itemDate) return false;
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return itemDate < oneMonthAgo;
}

/**
 * Returns `true` when the input can be parsed and falls within the current calendar year.
 * Empty or invalid values intentionally return `false`.
 */
export function isThisYear(dateStr: string | null): boolean {
  const itemDate = parseDate(dateStr);
  return !!itemDate && itemDate.getFullYear() === new Date().getFullYear();
}
