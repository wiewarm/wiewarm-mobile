import { create, insertMultiple, search } from '@orama/orama';
import type { Results } from '@orama/orama';

import type { BadItem } from '../services/interfaces/bad-item.interface';
import {
  SEARCH_PROPERTY_NAMES,
  SEARCH_RELEVANCE,
} from './constants/bad-search';
import {
  mapBadItemToSearchDocument,
  mapBadItemToSearchSuggestionDocuments,
  type BadSearchDocument,
  type BadSearchSuggestionDocument,
} from './mappers/bad-search.mapper';
import { normalizeSearchText } from './normalize-search-text.util';
import { parseTempFilter } from './parse-temp-filter.util';

type BadSearchDb = Awaited<ReturnType<typeof createBadSearchDb>>;
type BadSearchSuggestionDb = Awaited<
  ReturnType<typeof createBadSearchSuggestionDb>
>;
export type BadSearchIndex = {
  readonly db: BadSearchDb;
  readonly suggestionDb: BadSearchSuggestionDb;
  readonly items: BadItem[];
  readonly itemsByBeckenId: ReadonlyMap<number, BadItem>;
};

export async function createBadSearchIndex(
  items: BadItem[],
): Promise<BadSearchIndex> {
  const db = await createBadSearchDb();
  const suggestionDb = await createBadSearchSuggestionDb();
  await insertMultiple(db, items.map(mapBadItemToSearchDocument));
  await insertMultiple(
    suggestionDb,
    items.flatMap(mapBadItemToSearchSuggestionDocuments),
  );
  return {
    db,
    suggestionDb,
    items,
    itemsByBeckenId: new Map(items.map((item) => [item.beckenid, item])),
  };
}

export function searchBadItems(
  { db, items, itemsByBeckenId }: BadSearchIndex,
  term: string,
): BadItem[] {
  const { rawQuery, normalizedQuery, tempFilter } = parseSearchQuery(term);
  const requiredTokens = searchTokens(normalizedQuery);

  if (!rawQuery) {
    return items;
  }

  const { hits } = search(db, {
    term: normalizedQuery,
    properties: SEARCH_PROPERTY_NAMES,
    boost: SEARCH_RELEVANCE,
    // Short queries (<=3 characters) must match exactly; longer ones may have 1 typo.
    // This prevents queries like "Bad" from suddenly returning both "Bad Ragaz" AND "Bern".
    tolerance: toleranceForQuery(normalizedQuery),
    // Weak matches, such as a single letter somewhere in the text, are filtered out.
    threshold: 0.8,
    limit: items.length,
    ...(tempFilter && { where: { temp: { between: tempFilter.range } } }),
  }) as Results<BadSearchDocument>;

  return hits
    .map((hit) => itemsByBeckenId.get(hit.document.beckenid))
    .filter((item): item is BadItem => item != null)
    .filter((item) => matchesAllTokens(item, requiredTokens));
}

export function suggestBadSearchTerm(
  { suggestionDb }: BadSearchIndex,
  term: string,
): string | null {
  const { rawQuery, searchableQuery } = parseSearchQuery(term);

  if (rawQuery.length < 3) return null;
  if (!searchableQuery) return null;

  const { hits } = search(suggestionDb, {
    term: normalizeSearchText(searchableQuery),
    properties: ['normalizedSuggestion'],
    // Longer queries get slightly more fuzzy tolerance.
    tolerance: rawQuery.length <= 4 ? 1 : 2,
    threshold: 0.8,
    limit: 1,
  }) as Results<BadSearchSuggestionDocument>;

  return hits[0]?.document.suggestion ?? null;
}

function parseSearchQuery(input: string) {
  const rawQuery = input.trim();
  const tempFilter = parseTempFilter(rawQuery);
  const searchableQuery = tempFilter?.cleanQuery ?? rawQuery;

  return {
    rawQuery,
    searchableQuery,
    normalizedQuery: searchableQuery
      ? normalizeSearchText(searchableQuery)
      : undefined,
    tempFilter,
  };
}

/**
 * <=3 characters -> no fuzzy matching; exact prefix matching is enough
 * 4-6 characters -> 1 typo allowed
 * >=7 characters -> stays at 1 because 2 would create too much noise
 */
function toleranceForQuery(query: string | undefined): number {
  if (!query || query.length <= 3) return 0;
  return 1;
}

function searchTokens(query: string | undefined): string[] {
  return query?.split(/\s+/).filter(Boolean) ?? [];
}

/**
 * Orama treats multi-word queries as OR by default ("Bad Ragaz" → hits for "Bad" OR "Ragaz").
 * This filter enforces AND semantics: every token must appear somewhere in the item's text fields.
 * Single-token queries are skipped — Orama handles those well enough on its own.
 */
function matchesAllTokens(item: BadItem, tokens: string[]): boolean {
  if (tokens.length <= 1) return true;

  const searchableText = normalizeSearchText(
    item.bad,
    item.ort,
    item.plz,
    item.kanton,
    item.becken,
  );
  return tokens.every((token) => searchableText.includes(token));
}

async function createBadSearchDb() {
  return create({
    schema: {
      beckenid: 'number',
      temp: 'number',
      normalizedBad: 'string',
      normalizedOrt: 'string',
      normalizedPlz: 'string',
      normalizedKanton: 'string',
      normalizedBecken: 'string',
    },
  });
}

async function createBadSearchSuggestionDb() {
  return create({
    schema: {
      id: 'string',
      suggestion: 'string',
      normalizedSuggestion: 'string',
    },
  });
}
