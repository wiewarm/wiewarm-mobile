import { inject, Injectable, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, lastValueFrom, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { NewsStoryItem } from './interfaces/news-story.interface';
import { CacheEntry, isCacheEntryFresh } from '../util/cache.util';
import { toTimestamp } from '../util/date.util';
import { mapImagesToStories } from '../util/mappers/image.mapper';
import { mapNewsToStories } from '../util/mappers/news.mapper';
import {
  type ImageItem,
  type NewsItem,
  imageItemsSchema,
  newsItemsSchema,
} from './schemas/news-story.schema';

@Injectable({ providedIn: 'root' })
export class StoryService {
  private readonly http = inject(HttpClient);
  private get apiBase() {
    return environment.apiBase;
  }

  private storiesCache?: CacheEntry<NewsStoryItem[]>;

  readonly newsStoriesResource = resource<NewsStoryItem[], Error>({
    loader: () => this.loadStories(),
  });

  private async loadStories(): Promise<NewsStoryItem[]> {
    if (isCacheEntryFresh(this.storiesCache)) {
      return this.storiesCache.data;
    }

    try {
      const data = await lastValueFrom(
        forkJoin({
          news: this.http.get<unknown>(`${this.apiBase}/news.json`, {
            params: { search: '__latest__' },
          }),
          images: this.http.get<unknown>(`${this.apiBase}/image.json`, {
            params: { search: '__latest__' },
          }),
        }).pipe(
          map(({ news, images }) => {
            const validNews: NewsItem[] = newsItemsSchema.parse(news ?? []);
            const validImages: ImageItem[] = imageItemsSchema.parse(images ?? []);
            return [
              ...mapNewsToStories(validNews, validImages),
              ...mapImagesToStories(validImages),
            ].sort(
              (a, b) =>
                toTimestamp(b.publishedAt, b.publishedAtPretty) -
                toTimestamp(a.publishedAt, a.publishedAtPretty),
            );
          }),
        ),
      );

      this.storiesCache = { data, ts: Date.now() };
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Failed to load stories', { cause: error });
    }
  }
}
