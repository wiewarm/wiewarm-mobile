import type { BadItem } from '../services/interfaces/bad-item.interface';
import {
  createBadSearchIndex,
  searchBadItems,
  suggestBadSearchTerm,
} from './bad-search.util';

const items: BadItem[] = [
  createBadItem({
    beckenid: 1,
    bad: 'Seebad Tiefenbrunnen',
    ort: 'Z\u00fcrich',
    plz: '8008',
    kanton: 'ZH',
    becken: 'See',
  }),
  createBadItem({
    beckenid: 2,
    bad: 'Hallenbad City',
    ort: 'Bern',
    plz: '3000',
    kanton: 'BE',
    becken: 'Schwimmerbecken',
  }),
  createBadItem({
    beckenid: 3,
    bad: 'Freibad Wyler',
    ort: 'Bern',
    plz: '3014',
    kanton: 'BE',
    becken: 'Kinderbecken',
  }),
];

describe('bad search', () => {
  it('returns all items when query is empty', () => {
    expect(searchBadItems(createBadSearchIndex(items), '')).toEqual(items);
  });

  it('searches across bad, location and pool name', () => {
    const result = searchBadItems(createBadSearchIndex(items), 'schwimmer');

    expect(result).toEqual([items[1]]);
  });

  it('finds umlauted locations with plain ascii input', () => {
    const result = searchBadItems(createBadSearchIndex(items), 'zurich');

    expect(result).toEqual([items[0]]);
  });

  it('searches by postal code', () => {
    const result = searchBadItems(createBadSearchIndex(items), '8008');

    expect(result).toEqual([items[0]]);
  });

  it('searches one or two digit numbers as temperature', () => {
    const result = searchBadItems(createBadSearchIndex(items), '22');

    expect(result).toEqual([items[0], items[1], items[2]]);
  });

  it('searches by canton', () => {
    const result = searchBadItems(createBadSearchIndex(items), 'zh');

    expect(result).toEqual([items[0]]);
  });

  it('keeps ranked Orama results in result order', () => {
    const result = searchBadItems(createBadSearchIndex(items), 'bern');

    expect(result).toEqual([items[1], items[2]]);
  });

  it('suggests a close search term for empty results', () => {
    const suggestion = suggestBadSearchTerm(
      createBadSearchIndex(items),
      'zurih',
    );

    expect(suggestion).toBe('Z\u00fcrich');
  });

  it('suggests a close prefix for partial typos', () => {
    const suggestion = suggestBadSearchTerm(
      createBadSearchIndex(items),
      'hellq',
    );

    expect(suggestion).toBe('Hallenbad');
  });
});

function createBadItem(overrides: Partial<BadItem>): BadItem {
  return {
    badid: 1,
    badid_text: 'testbad',
    bad: 'Testbad',
    becken: 'Testbecken',
    plz: '8000',
    ort: 'Testort',
    date: '2026-05-26',
    date_pretty: '26.05.2026',
    beckenid: 1,
    temp: 22,
    ortlat: 47.3769,
    ortlong: 8.5417,
    kanton: 'ZH',
    ...overrides,
  };
}
