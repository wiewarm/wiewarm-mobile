import { mapNewsAndImagesToStories } from './news-story.mapper';
import type { ImageApiItem, NewsApiItem } from '../services/interfaces/news-story.interface';

describe('news-story.mapper', () => {
  it('maps news and images into a sorted unified story list', () => {
    const news: NewsApiItem[] = [
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
    ];

    const images: ImageApiItem[] = [
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
    ];

    const stories = mapNewsAndImagesToStories(news, images);

    expect(stories.length).toBe(2);
    expect(stories[0].kind).toBe('impression');
    expect(stories[0].imageUrl).toContain('/img/baeder-orig/7/1.jpg');
    expect(stories[1].id).toBe('news:7:17031');
    expect(stories[1].thumbnailUrl).toContain('/img/baeder-thumbnail/7/1.jpg');
  });

  it('applies fallback values for missing optional fields', () => {
    const stories = mapNewsAndImagesToStories(
      [
        {
          badid: 1,
          badname: 'Testbad',
          ort: 'Bern',
          kanton: 'BE',
          plz: '3000',
          infoid: 99,
          date: '',
          info: '',
          date_pretty: '',
        },
      ],
      [
        {
          image: '/img/baeder/1/1.jpg',
          badid: '1',
          badname: 'Testbad',
          ort: 'Bern',
          plz: '3000',
          kanton: 'BE',
        },
      ],
    );

    const news = stories.find((s) => s.kind === 'news');
    const image = stories.find((s) => s.kind === 'impression');

    expect(news?.publishedAt).toBeNull();
    expect(news?.body).toBe('');
    expect(image?.thumbnailUrl).toContain('/img/baeder/1/1.jpg');
    expect(image?.body).toBe('');
  });
});
