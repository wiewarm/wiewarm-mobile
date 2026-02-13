export const FILTER_FIELDS = {
  aktuell: 'Aktuelle',
  all: 'Alle',
} as const;

export type FilterField = keyof typeof FILTER_FIELDS;
