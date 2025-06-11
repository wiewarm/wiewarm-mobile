export function isOlderThanOneMonth(
  dateStr: string | null | undefined
): boolean {
  if (!dateStr) return false;
  const itemDate = new Date(dateStr.replace(' ', 'T'));
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);
  return itemDate < oneMonthAgo;
}
