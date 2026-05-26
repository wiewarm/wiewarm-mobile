import type { BadItem } from '../../services/interfaces/bad-item.interface';
import { SUGGEST_PROPERTIES } from '../constants/bad-search';
import { normalizeSearchText } from '../normalize-search-text.util';

export type BadSearchDocument = Pick<BadItem, 'beckenid' | 'temp'> & {
  readonly id: string;
  readonly normalizedBad: string;
  readonly normalizedOrt: string;
  readonly normalizedPlz: string;
  readonly normalizedKanton: string;
  readonly normalizedBecken: string;
};

export type BadSearchSuggestionDocument = {
  readonly id: string;
  readonly suggestion: string;
  readonly normalizedSuggestion: string;
};

export function mapBadItemToSearchDocument(item: BadItem): BadSearchDocument {
  return {
    id: String(item.beckenid),
    beckenid: item.beckenid,
    temp: item.temp,
    normalizedBad: normalizeSearchText(item.bad),
    normalizedOrt: normalizeSearchText(item.ort),
    normalizedPlz: normalizeSearchText(item.plz),
    normalizedKanton: normalizeSearchText(item.kanton),
    normalizedBecken: normalizeSearchText(item.becken),
  };
}

export function mapBadItemToSearchSuggestionDocuments(
  item: BadItem,
): BadSearchSuggestionDocument[] {
  const suggestions = new Map<string, string>();

  SUGGEST_PROPERTIES.flatMap((property) => {
    const value = item[property];
    return [...value.split(/\s+/), value];
  }).forEach((suggestion) => {
    normalizedPrefixes(suggestion).forEach((normalizedSuggestion) => {
      if (!suggestions.has(normalizedSuggestion)) {
        suggestions.set(normalizedSuggestion, suggestion);
      }
    });
  });

  return Array.from(suggestions, ([normalizedSuggestion, suggestion], index) => ({
      id: `${item.beckenid}-${index}`,
      suggestion,
      normalizedSuggestion,
    }));
}

function normalizedPrefixes(value: string): string[] {
  const normalizedValue = normalizeSearchText(value);
  return Array.from(
    { length: Math.max(normalizedValue.length - 2, 0) },
    (_, index) => normalizedValue.slice(0, index + 3),
  );
}
