export const FILTER_FIELDS = {
  aktuell: 'Aktuelle',
  all: 'Alle',
} as const;

export type FilterField = keyof typeof FILTER_FIELDS;

export interface FilterOption {
  value: FilterField;
  label: string;
}

export const FILTER_OPTION_LIST: FilterOption[] = Object.entries(
  FILTER_FIELDS
).map(([value, label]) => ({
  value: value as FilterField,
  label,
}));
