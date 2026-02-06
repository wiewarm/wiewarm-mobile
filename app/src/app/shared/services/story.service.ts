import { inject, Injectable, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, lastValueFrom, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  ImageApiItem,
  NewsApiItem,
  NewsStoryItem,
} from './interfaces/news-story.interface';
import { mapNewsAndImagesToStories } from '../util/news-story.mapper';

type CacheEntry<T> = { data: T; ts: number };

@Injectable({ providedIn: 'root' })
export class StoryService {
  private readonly http = inject(HttpClient);
  private get apiBase() {
    return environment.apiBase;
  }

  private readonly TTL_MS = 5 * 60_000;
  private storiesCache?: CacheEntry<NewsStoryItem[]>;

  readonly newsStoriesResource = resource<NewsStoryItem[], Error>({
    loader: () => this.loadStories(),
  });

  private isFresh<T>(entry?: CacheEntry<T>): entry is CacheEntry<T> {
    return !!entry && Date.now() - entry.ts <= this.TTL_MS;
  }

  private async loadStories(): Promise<NewsStoryItem[]> {
    if (this.isFresh(this.storiesCache)) {
      return this.storiesCache.data;
    }

    try {
      const data = await lastValueFrom(
        forkJoin({
          news: this.http.get<NewsApiItem[]>(`${this.apiBase}/news.json`, {
            params: { search: '__latest__' },
          }),
          images: this.http.get<ImageApiItem[]>(`${this.apiBase}/image.json`, {
            params: { search: '__latest__' },
          }),
        }).pipe(
          map(({ news, images }) =>
            mapNewsAndImagesToStories(news ?? [], images ?? []),
          ),
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
