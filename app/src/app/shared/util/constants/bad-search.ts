import type { BadSearchDocument } from '../mappers/bad-search.mapper';

export type SuggestProperty = 'bad' | 'ort' | 'kanton';
type SearchProperty = Extract<keyof BadSearchDocument, `normalized${string}`>;

// Fields used for result search, including their ranking weight.
const SEARCH_PROPERTIES: { name: SearchProperty; relevance: number }[] = [
  { name: 'normalizedBad', relevance: 2 },
  { name: 'normalizedOrt', relevance: 1.5 },
  { name: 'normalizedPlz', relevance: 1.2 },
  { name: 'normalizedKanton', relevance: 1 },
  { name: 'normalizedBecken', relevance: 1 },
];

export const SEARCH_PROPERTY_NAMES = SEARCH_PROPERTIES.map(({ name }) => name);
export const SEARCH_RELEVANCE = Object.fromEntries(
  SEARCH_PROPERTIES.map(({ name, relevance }) => [name, relevance]),
) as Record<SearchProperty, number>;

// Fields used for correction suggestions; limited to values that make useful suggest-search terms.
export const SUGGEST_PROPERTIES: SuggestProperty[] = ['bad', 'ort', 'kanton'];
