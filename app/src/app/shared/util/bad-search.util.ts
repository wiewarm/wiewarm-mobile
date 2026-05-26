import { create, insertMultiple, search } from '@orama/orama';
import type { Results } from '@orama/orama';

import type { BadItem } from '../services/interfaces/bad-item.interface';
import { parseTempFilter } from './constants/parse-temp-filter';

type BadSearchDb = Awaited<ReturnType<typeof createBadSearchDb>>;
type BadSearchDocument = BadItem & {
  readonly id: string;
  readonly searchText: string;
};
export type BadSearchIndex = {
  readonly db: BadSearchDb;
  readonly items: BadItem[];
};

export async function createBadSearchIndex(
  items: BadItem[],
): Promise<BadSearchIndex> {
  const db = await createBadSearchDb();
  await insertMultiple(
    db,
    items.map((item) => ({
      id: String(item.beckenid),
      beckenid: item.beckenid,
      bad: item.bad,
      ort: item.ort,
      plz: item.plz,
      kanton: item.kanton,
      becken: item.becken,
      // Normalisierter Text für ASCII-Queries wie "zurich" statt "zürich".
      // Wird nur als Fallback-Property gesucht (geringster Boost).
      searchText: normalizeSearchText(
        item.bad,
        item.ort,
        item.plz,
        item.kanton,
        item.becken,
      ),
      temp: item.temp,
    })),
  );
  return { items, db };
}

export function searchBadItems(
  { db, items }: BadSearchIndex,
  term: string,
): BadItem[] {
  const query = term.trim();

  if (!query) {
    return items;
  }

  const tempFilter = parseTempFilter(query);
  const cleanQuery = tempFilter?.cleanQuery ?? query;

  const normalizedQuery = cleanQuery ? normalizeSearchText(cleanQuery) : undefined;

  const { hits } = search(db, {
    term: normalizedQuery,
    // searchText wird bewusst ausgelassen: Die normalisierten Originalfelder
    // (bad, ort, …) matchen bereits – searchText würde Scores nur verzerren.
    properties: ['bad', 'ort', 'plz', 'kanton', 'becken'],
    boost: {
      bad: 2,
      ort: 1.5,
      plz: 1.2,
      kanton: 1,
      becken: 1,
    },
    // Kurze Queries (≤3 Zeichen) müssen exakt matchen, längere dürfen 1 Fehler haben.
    // Damit verhindert man, dass z.B. "Bad" plötzlich "Bad Ragaz" UND "Bern" liefert.
    tolerance: toleranceForQuery(normalizedQuery),
    // Schwache Treffer (z.B. einzelner Buchstabe irgendwo im Text) werden abgeschnitten.
    threshold: 0.8,
    limit: items.length,
    ...(tempFilter && { where: { temp: { between: tempFilter.range } } }),
  }) as Results<BadSearchDocument>;

  const byId = new Map(items.map((item) => [item.beckenid, item]));
  return hits
    .map((hit) => byId.get(hit.document.beckenid))
    .filter((item): item is BadItem => item != null);
}

export function suggestBadSearchTerm(
  { db }: BadSearchIndex,
  term: string,
): string | null {
  const query = term.trim();
  if (query.length < 3) return null;

  const tempFilter = parseTempFilter(query);
  const cleanQuery = tempFilter?.cleanQuery ?? query;
  if (!cleanQuery) return null;

  // Orama's tolerance-based fuzzy search erledigt die Ähnlichkeitssuche –
  // kein manuelles Levenshtein nötig.
  const { hits } = search(db, {
    term: normalizeSearchText(cleanQuery),
    properties: ['bad', 'ort', 'kanton'],
    tolerance: query.length <= 4 ? 1 : 2,
    limit: 1,
  }) as Results<BadSearchDocument>;

  if (!hits.length) return null;

  const best = hits[0].document;
  return best.bad ?? best.ort ?? best.kanton ?? null;
}

/**
 * ≤3 Zeichen → kein Fuzzy (exakter Prefix-Match reicht)
 * 4–6 Zeichen → 1 Fehler erlaubt
 * ≥7 Zeichen → bleibt bei 1 (2 würde zu viel Rauschen erzeugen)
 */
function toleranceForQuery(query: string | undefined): number {
  if (!query || query.length <= 3) return 0;
  return 1;
}

async function createBadSearchDb() {
  return create({
    schema: {
      beckenid: 'number',
      bad: 'string',
      ort: 'string',
      plz: 'string',
      kanton: 'string',
      becken: 'string',
      searchText: 'string',
      temp: 'number',
    },
  });
}

function normalizeSearchText(...values: string[]): string {
  return values
    .join(' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}