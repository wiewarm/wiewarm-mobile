import { environment } from '../../../../environments/environment';
import type { ImageItem } from '../../services/schemas/news-story.schema';
import { hashString } from './news-story.mapper.utils';
import { mapImagesToStories } from './image.mapper';

describe('mapImagesToStories', () => {
  let originalImageBase: string;

  beforeEach(() => {
    originalImageBase = environment.imageBase;
    environment.imageBase = 'https://test.example.com/images';
  });

  afterEach(() => {
    environment.imageBase = originalImageBase;
  });

  const makeImage = (overrides: Partial<ImageItem> = {}): ImageItem => ({
    image: 'photo.jpg',
    badid: '42',
    badname: 'Seebad',
    ort: 'Bern',
    plz: '3000',
    kanton: 'BE',
    ...overrides,
  });

  it('maps an image item to a NewsStoryItem with kind=impression', () => {
    const story = mapImagesToStories([makeImage()])[0];

    expect(story.kind).toBe('impression');
    expect(story.badId).toBe('42');
    expect(story.badName).toBe('Seebad');
    expect(story.locationText).toBe('3000 Bern');
    expect(story.title).toBe('Bild hochgeladen von Seebad, Bern');
  });

  it('generates a deterministic ID from badid and image hash', () => {
    const item = makeImage({ badid: '42', original: 'orig.jpg' });
    const story = mapImagesToStories([item])[0];

    expect(story.id).toBe(`img:42:${hashString('orig.jpg')}`);
  });

  it('uses original over image for imageUrl', () => {
    const item = makeImage({ image: 'img.jpg', original: 'orig.jpg' });
    expect(mapImagesToStories([item])[0].imageUrl).toContain('orig.jpg');
  });

  it('falls back to image when original is absent', () => {
    const item = makeImage({ image: 'fallback.jpg' });
    expect(mapImagesToStories([item])[0].imageUrl).toContain('fallback.jpg');
  });

  it('uses thumbnail for thumbnailUrl', () => {
    const item = makeImage({ image: 'img.jpg', thumbnail: 'thumb.jpg' });
    expect(mapImagesToStories([item])[0].thumbnailUrl).toContain('thumb.jpg');
  });

  it('falls back to image for thumbnailUrl when thumbnail is absent', () => {
    const item = makeImage({ image: 'img.jpg' });
    expect(mapImagesToStories([item])[0].thumbnailUrl).toContain('img.jpg');
  });

  it('sets publishedAt and publishedAtPretty from item dates', () => {
    const item = makeImage({ date: '2024-05-15', date_pretty: '15.05.2024' });
    const story = mapImagesToStories([item])[0];

    expect(story.publishedAt).toBe('2024-05-15');
    expect(story.publishedAtPretty).toBe('15.05.2024');
  });

  it('sets null dates when item has no date fields', () => {
    const item = makeImage({ date: undefined, date_pretty: undefined });
    const story = mapImagesToStories([item])[0];

    expect(story.publishedAt).toBeNull();
    expect(story.publishedAtPretty).toBeNull();
  });

  it('trims description into body', () => {
    const item = makeImage({ description: '  Seeblick  ' });
    expect(mapImagesToStories([item])[0].body).toBe('Seeblick');
  });

  it('returns empty body when description is absent', () => {
    const item = makeImage({ description: undefined });
    expect(mapImagesToStories([item])[0].body).toBe('');
  });

  it('returns empty array for empty input', () => {
    expect(mapImagesToStories([])).toEqual([]);
  });
});
