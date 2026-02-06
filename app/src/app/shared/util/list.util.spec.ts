import { filterItems, sortItems } from './list.util';

type Item = {
  name?: string | null;
  city?: string | null;
  age?: number | null;
  created?: Date | null;
};

const data: Item[] = [
  { name: 'Anna', city: 'Zürich', age: 29, created: new Date('2024-03-10') },
  { name: 'bob', city: 'bern', age: 2, created: new Date('2024-01-01') },
  { name: 'Carl', city: null, age: 10, created: null },
  { name: null, city: 'Luzern', age: null, created: new Date('2025-06-15') },
  { name: '10', city: 'Basel', age: 10, created: new Date('2023-12-31') },
];

describe('filterItems', () => {
  it('returns original array when term is empty', () => {
    expect(filterItems(data, '', ['name', 'city'])).toEqual(data);
  });

  it('filters case-insensitiv über mehrere Felder', () => {
    const res = filterItems(data, 'bern', ['name', 'city']);
    expect(res).toEqual([data[1]]);
  });

  it('behandelt null/undefined Felder robust', () => {
    const res = filterItems(data, 'luz', ['city']);
    expect(res).toEqual([data[3]]);
  });

  it('findet Treffer auch in Zahlen via String-Konvertierung', () => {
    const res = filterItems(data, '10', ['name', 'age']);
    // name === "10" und age === 10 (2 Einträge)
    expect(res).toEqual([data[2], data[4]]);
  });

  it('liefert leeres Array, wenn kein Treffer', () => {
    expect(filterItems(data, 'does-not-exist', ['name'])).toEqual([]);
  });
});

describe('sortItems', () => {
  it('sortiert Strings numerisch-freundlisch (localeCompare numeric)', () => {
    const items = [{ v: '2' }, { v: '10' }, { v: '1' }];
    const res = sortItems(items, 'v', 'asc').map((i) => i.v);
    expect(res).toEqual(['1', '2', '10']);
  });

  it('sortiert Zahlen korrekt', () => {
    const items = [{ v: 3 }, { v: 1 }, { v: 2 }];
    const resAsc = sortItems(items, 'v', 'asc').map((i) => i.v);
    const resDesc = sortItems(items, 'v', 'desc').map((i) => i.v);
    expect(resAsc).toEqual([1, 2, 3]);
    expect(resDesc).toEqual([3, 2, 1]);
  });

  it('sortiert Date-Objekte nach Zeitstempel', () => {
    const items = [
      { d: new Date('2024-01-01') },
      { d: new Date('2025-06-15') },
      { d: new Date('2023-12-31') },
    ];
    const res = sortItems(items, 'd', 'asc').map((i) =>
      i.d!.toISOString().slice(0, 10),
    );
    expect(res).toEqual(['2023-12-31', '2024-01-01', '2025-06-15']);
  });

  it('legt null/undefined immer ans Ende (egal welche Richtung)', () => {
    const items = [{ n: 2 }, { n: null }, { n: 1 }, { n: undefined as any }];
    const asc = sortItems(items, 'n', 'asc').map(
      (i) => i.n as number | null | undefined,
    );
    const desc = sortItems(items, 'n', 'desc').map(
      (i) => i.n as number | null | undefined,
    );

    expect(asc.slice(-2)).toEqual([null, undefined]);
    expect(desc.slice(-2)).toEqual([null, undefined]);
  });
});
