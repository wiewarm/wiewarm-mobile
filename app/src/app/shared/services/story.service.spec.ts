import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { StoryService } from './story.service';

describe('StoryService', () => {
  let httpMock: HttpTestingController;
  let originalApiBase: string;
  const newsUrlSuffix = '/news.json';
  const imageUrlSuffix = '/image.json';

  beforeEach(() => {
    originalApiBase = environment.apiBase;
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StoryService],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    environment.apiBase = originalApiBase;
    httpMock.verify();
  });

  it('loads stories from news and image endpoints and merges them', fakeAsync(() => {
    const service = TestBed.inject(StoryService);

    let result: any[] | undefined;
    (service as any).loadStories().then((value: any[]) => {
      result = value;
    });

    const newsReq = httpMock.expectOne((r) => r.url.endsWith(newsUrlSuffix));
    const imageReq = httpMock.expectOne((r) => r.url.endsWith(imageUrlSuffix));

    expect(newsReq.request.params.get('search')).toBe('__latest__');
    expect(imageReq.request.params.get('search')).toBe('__latest__');

    newsReq.flush([
      {
        badid: 7,
        badname: 'Badebetriebe Thun',
        ort: 'Thun',
        kanton: 'BE',
        plz: '3604',
        infoid: 17031,
        date: '2025-11-23 16:13:48',
        info: 'Voraussichtliche Saisoneroeffnung',
        date_pretty: '2025',
      },
    ]);

    imageReq.flush([
      {
        image: '/img/baeder/7/1.jpg',
        thumbnail: '/img/baeder-thumbnail/7/1.jpg',
        original: '/img/baeder-orig/7/1.jpg',
        description: 'Winterbaden',
        date: '2025-11-24 10:00:00',
        date_pretty: '2025',
        badid: '7',
        badname: 'Badebetriebe Thun',
        ort: 'Thun',
        plz: '3604',
        kanton: 'BE',
      },
    ]);

    tick();

    expect(result?.length).toBe(2);
    expect(result?.[0].kind).toBe('impression');
    expect(result?.[1].kind).toBe('news');
  }));
});
