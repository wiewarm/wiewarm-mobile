import { environment } from '../../../../environments/environment';
import type {
  ImageItem,
  NewsItem,
} from '../../services/schemas/news-story.schema';
import { mapNewsToStories } from './news.mapper';

describe('mapNewsToStories', () => {
  let originalImageBase: string;

  beforeEach(() => {
    originalImageBase = environment.imageBase;
    environment.imageBase = 'https://test.example.com/images';
  });

  afterEach(() => {
    environment.imageBase = originalImageBase;
  });

  const makeNews = (overrides: Partial<NewsItem> = {}): NewsItem => ({
    badid: 1,
    badname: 'Testbad',
    ort: 'Zürich',
    kanton: 'ZH',
    plz: '8000',
    infoid: 100,
    date: '2024-06-01',
    info: 'Test-Info',
    date_pretty: '01.06.2024',
    ...overrides,
  });

  const makeImage = (overrides: Partial<ImageItem> = {}): ImageItem => ({
    image: 'photo.jpg',
    badid: 1,
    badname: 'Testbad',
    ort: 'Zürich',
    plz: '8000',
    kanton: 'ZH',
    ...overrides,
  });

  it('maps a news item to a NewsStoryItem with all fields', () => {
    const story = mapNewsToStories([makeNews()], [])[0];

    expect(story.id).toBe('news:1:100');
    expect(story.kind).toBe('news');
    expect(story.badId).toBe(1);
    expect(story.badName).toBe('Testbad');
    expect(story.locationText).toBe('8000 Zürich');
    expect(story.title).toBe('Mitteilung von Testbad, Zürich');
    expect(story.body).toBe('Test-Info');
    expect(story.publishedAt).toBe('2024-06-01');
    expect(story.publishedAtPretty).toBe('01.06.2024');
  });

  it('attaches image and thumbnail from matching badid', () => {
    const img = makeImage({ image: 'photo.jpg', thumbnail: 'thumb.jpg' });
    const story = mapNewsToStories([makeNews()], [img])[0];

    expect(story.imageUrl).toContain('photo.jpg');
    expect(story.thumbnailUrl).toContain('thumb.jpg');
  });

  it('returns null image URLs when no image matches', () => {
    const img = makeImage({ badid: 99 });
    const story = mapNewsToStories([makeNews({ badid: 1 })], [img])[0];

    expect(story.imageUrl).toBeNull();
    expect(story.thumbnailUrl).toBeNull();
  });

  it('picks the latest image when multiple images share a badid', () => {
    const older = makeImage({ image: 'old.jpg', date: '2023-01-01' });
    const newer = makeImage({ image: 'new.jpg', date: '2024-06-01' });
    const story = mapNewsToStories([makeNews()], [older, newer])[0];

    expect(story.imageUrl).toContain('new.jpg');
  });

  it('falls back to image without a date when no dated image exists', () => {
    const undated = makeImage({ image: 'undated.jpg', date: undefined });
    const story = mapNewsToStories([makeNews()], [undated])[0];

    expect(story.imageUrl).toContain('undated.jpg');
  });

  it('trims whitespace from body and returns empty string for blank info', () => {
    const story = mapNewsToStories([makeNews({ info: '  ' })], [])[0];
    expect(story.body).toBe('');
  });

  it('returns empty array for empty input', () => {
    expect(mapNewsToStories([], [])).toEqual([]);
  });
});
