import { environment } from '../../../../environments/environment';
import {
  formatLocation,
  hashString,
  resolveImageUrl,
  trimOrNull,
} from './news-story.mapper.utils';

describe('trimOrNull', () => {
  it('returns null for undefined', () => expect(trimOrNull(undefined)).toBeNull());
  it('returns null for null', () => expect(trimOrNull(null)).toBeNull());
  it('returns null for empty string', () => expect(trimOrNull('')).toBeNull());
  it('returns null for whitespace-only', () => expect(trimOrNull('   ')).toBeNull());
  it('trims surrounding whitespace', () => expect(trimOrNull('  hello  ')).toBe('hello'));
  it('returns plain string unchanged', () => expect(trimOrNull('foo')).toBe('foo'));
});

describe('formatLocation', () => {
  it('joins plz and ort with a space', () =>
    expect(formatLocation('8000', 'Zürich')).toBe('8000 Zürich'));
  it('returns only plz when ort is missing', () =>
    expect(formatLocation('8000', undefined)).toBe('8000'));
  it('returns only ort when plz is missing', () =>
    expect(formatLocation(undefined, 'Zürich')).toBe('Zürich'));
  it('returns empty string when both are missing', () =>
    expect(formatLocation(undefined, undefined)).toBe(''));
  it('trims both values', () =>
    expect(formatLocation('  8000 ', ' Zürich ')).toBe('8000 Zürich'));
});

describe('resolveImageUrl', () => {
  const base = 'https://test.example.com/images';

  it('returns null for undefined', () => expect(resolveImageUrl(undefined, base)).toBeNull());
  it('returns null for empty string', () => expect(resolveImageUrl('', base)).toBeNull());
  it('returns null for whitespace-only', () =>
    expect(resolveImageUrl('   ', base)).toBeNull());

  it('returns an absolute URL unchanged', () => {
    const url = 'https://cdn.example.com/img.jpg';
    expect(resolveImageUrl(url, base)).toBe(url);
  });

  it('resolves a relative path against the base', () =>
    expect(resolveImageUrl('foo/bar.jpg', base)).toBe(
      'https://test.example.com/images/foo/bar.jpg',
    ));

  it('strips leading slashes from relative path', () =>
    expect(resolveImageUrl('/foo/bar.jpg', base)).toBe(
      'https://test.example.com/images/foo/bar.jpg',
    ));

  it('uses environment.imageBase as default base', () => {
    const original = environment.imageBase;
    environment.imageBase = 'https://env.example.com/proxy';
    expect(resolveImageUrl('img.jpg')).toBe('https://env.example.com/proxy/img.jpg');
    environment.imageBase = original;
  });
});

describe('hashString', () => {
  it('returns a hexadecimal string', () =>
    expect(hashString('test')).toMatch(/^[0-9a-f]+$/));

  it('is deterministic for the same input', () =>
    expect(hashString('hello')).toBe(hashString('hello')));

  it('produces different hashes for different inputs', () =>
    expect(hashString('foo')).not.toBe(hashString('bar')));

  it('handles empty string without throwing', () =>
    expect(() => hashString('')).not.toThrow());
});
