function parseDate(dateStr: string | null): Date | null {
  return dateStr ? new Date(dateStr.replace(' ', 'T')) : null;
}

export function isOlderThanOneMonth(dateStr: string | null): boolean {
  const itemDate = parseDate(dateStr);
  if (!itemDate) return false;
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);
  return itemDate < oneMonthAgo;
}

export function isThisYear(dateStr: string | null): boolean {
  const itemDate = parseDate(dateStr);
  return itemDate ? itemDate.getFullYear() === new Date().getFullYear() : false;
}
