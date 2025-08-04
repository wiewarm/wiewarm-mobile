export const SORT_FIELDS = {
  kanton: 'Kanton',
  ort: 'Ort',
  temp: 'Temperatur',
} as const;

export type SortField = keyof typeof SORT_FIELDS;
export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  field: SortField;
  direction: SortDirection;
  label: string;
  icon: string;
}

export const SORT_OPTION_LIST: SortOption[] = Object.entries(
  SORT_FIELDS
).flatMap(([field, label]) => [
  {
    field: field as SortField,
    direction: 'asc',
    label,
    icon: 'assets/img/up.png',
  },
  {
    field: field as SortField,
    direction: 'desc',
    label,
    icon: 'assets/img/down.png',
  },
]);
