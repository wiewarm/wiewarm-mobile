import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { StoryService } from './story.service';

describe('StoryService', () => {
  let httpMock: HttpTestingController;
  let originalApiBase: string;
  let originalImageBase: string;

  const API = 'https://test.example.com/api';
  const newsUrl = `${API}/news.json`;
  const imagesUrl = `${API}/image.json`;

  beforeEach(() => {
    originalApiBase = environment.apiBase;
    originalImageBase = environment.imageBase;
    environment.apiBase = API;
    environment.imageBase = 'https://test.example.com/images';

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StoryService],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    environment.apiBase = originalApiBase;
    environment.imageBase = originalImageBase;
    httpMock.verify();
  });

  const flush = (newsData: object = [], imagesData: object = []) => {
    httpMock.expectOne((r) => r.url === newsUrl).flush(newsData);
    httpMock.expectOne((r) => r.url === imagesUrl).flush(imagesData);
  };

  const validNewsItem = {
    badid: 1,
    badname: 'Freibad',
    ort: 'Zürich',
    kanton: 'ZH',
    plz: '8000',
    infoid: 10,
    date: '2024-06-10',
    info: 'Neuigkeit',
    date_pretty: '10.06.2024',
  };

  const validImageItem = {
    image: 'photo.jpg',
    badid: '2',
    badname: 'Seebad',
    ort: 'Bern',
    plz: '3000',
    kanton: 'BE',
    date: '2024-05-01',
    date_pretty: '01.05.2024',
  };

  it('requests news.json and image.json with search=__latest__', fakeAsync(() => {
    const service = TestBed.inject(StoryService);
    service.newsStoriesResource.value();
    tick();

    const newsReq = httpMock.expectOne((r) => r.url === newsUrl);
    expect(newsReq.request.method).toBe('GET');
    expect(newsReq.request.params.get('search')).toBe('__latest__');

    const imgReq = httpMock.expectOne((r) => r.url === imagesUrl);
    expect(imgReq.request.method).toBe('GET');
    expect(imgReq.request.params.get('search')).toBe('__latest__');

    newsReq.flush([]);
    imgReq.flush([]);
    tick();
  }));

  it('combines news and image items into stories', fakeAsync(() => {
    const service = TestBed.inject(StoryService);
    service.newsStoriesResource.value();
    tick();
    flush([validNewsItem], [validImageItem]);
    tick();

    const stories = service.newsStoriesResource.value()!;
    expect(stories).toHaveSize(2);
    expect(stories.some((s) => s.kind === 'news' && s.badId === '1')).toBeTrue();
    expect(stories.some((s) => s.kind === 'impression' && s.badId === '2')).toBeTrue();
  }));

  it('sorts combined stories newest-first', fakeAsync(() => {
    const service = TestBed.inject(StoryService);
    const older = { ...validNewsItem, date: '2024-01-01', infoid: 11 };
    const newer = { ...validNewsItem, date: '2024-06-10', infoid: 10 };

    service.newsStoriesResource.value();
    tick();
    flush([older, newer], []);
    tick();

    const stories = service.newsStoriesResource.value()!;
    expect(stories[0].publishedAt).toBe('2024-06-10');
    expect(stories[1].publishedAt).toBe('2024-01-01');
  }));

  it('returns empty list when both endpoints return empty arrays', fakeAsync(() => {
    const service = TestBed.inject(StoryService);
    service.newsStoriesResource.value();
    tick();
    flush([], []);
    tick();

    expect(service.newsStoriesResource.value()).toEqual([]);
  }));

  it('caches result and does not make additional HTTP requests within TTL', fakeAsync(() => {
    const service = TestBed.inject(StoryService);
    service.newsStoriesResource.value();
    tick();
    flush([validNewsItem], []);
    tick();

    // Second call to the private loader should resolve from cache
    let resolved = false;
    (service as any).loadStories().then(() => {
      resolved = true;
    });
    tick();

    expect(resolved).toBeTrue();
    httpMock.expectNone(newsUrl);
    httpMock.expectNone(imagesUrl);
  }));

  it('re-fetches after the cache TTL expires', fakeAsync(() => {
    const service = TestBed.inject(StoryService);
    service.newsStoriesResource.value();
    tick();
    flush([validNewsItem], []);
    tick();

    // Expire the cache by backdating its timestamp
    (service as any).storiesCache.ts = Date.now() - 6 * 60_000;

    (service as any).loadStories();
    tick();

    const newsReq = httpMock.expectOne((r) => r.url === newsUrl);
    const imgReq = httpMock.expectOne((r) => r.url === imagesUrl);
    expect(newsReq.request.params.get('search')).toBe('__latest__');
    newsReq.flush([]);
    imgReq.flush([]);
    tick();
  }));

  it('transitions resource to error state on invalid news data', fakeAsync(() => {
    const service = TestBed.inject(StoryService);
    service.newsStoriesResource.value();
    tick();

    httpMock.expectOne((r) => r.url === newsUrl).flush([{ invalid: true }]);
    httpMock.expectOne((r) => r.url === imagesUrl).flush([]);
    tick();

    expect(service.newsStoriesResource.error()).toBeInstanceOf(Error);
  }));

  it('keeps news available when image data is invalid', fakeAsync(() => {
    const service = TestBed.inject(StoryService);
    service.newsStoriesResource.value();
    tick();

    httpMock.expectOne((r) => r.url === newsUrl).flush([validNewsItem]);
    httpMock.expectOne((r) => r.url === imagesUrl).flush([{ invalid: true }]);
    tick();

    expect(service.newsStoriesResource.error()).toBeUndefined();
    expect(service.newsStoriesResource.value()).toEqual(
      jasmine.arrayContaining([
        jasmine.objectContaining({
          kind: 'news',
          infoId: 10,
        }),
      ]),
    );
  }));

  it('accepts string ids from news.json', fakeAsync(() => {
    const service = TestBed.inject(StoryService);
    service.newsStoriesResource.value();
    tick();

    httpMock.expectOne((r) => r.url === newsUrl).flush([
      {
        ...validNewsItem,
        badid: '1',
        infoid: '10',
      },
    ]);
    httpMock.expectOne((r) => r.url === imagesUrl).flush([]);
    tick();

    expect(service.newsStoriesResource.error()).toBeUndefined();
    expect(service.newsStoriesResource.value()).toEqual(
      jasmine.arrayContaining([
        jasmine.objectContaining({
          badId: '1',
          infoId: 10,
        }),
      ]),
    );
  }));
});
