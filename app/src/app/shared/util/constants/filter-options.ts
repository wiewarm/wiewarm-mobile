export const FILTER_OPTIONS = {
  aktuell: 'Aktuelle',
  all: 'Alle',
} as const;

export type FilterOption = keyof typeof FILTER_OPTIONS;

export const FILTER_OPTION_LIST = Object.entries(FILTER_OPTIONS).map(
  ([value, label]) => ({
    value: value as FilterOption,
    label,
  })
);
