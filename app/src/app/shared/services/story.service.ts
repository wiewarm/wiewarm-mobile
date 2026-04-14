import { inject, Injectable, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { NewsStoryItem } from './interfaces/news-story.interface';
import type { CacheEntry } from '../util/cache.util';
import { isCacheEntryFresh } from '../util/cache.util';
import { toTimestamp } from '../util/date.util';
import { mapImagesToStories } from '../util/mappers/image.mapper';
import { mapNewsToStories } from '../util/mappers/news.mapper';
import {
  type ImageItem,
  type NewsItem,
  imageItemsSchema,
  newsItemsSchema,
} from './schemas/news-story.schema';
import { AuthService } from './auth/auth.service';
import { EditCredentialError } from './bad.service';

@Injectable({ providedIn: 'root' })
export class StoryService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

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
      const [validNews, validImages] = await Promise.all([
        this.loadNewsItems(),
        this.loadImageItemsBestEffort(),
      ]);
      const data = [
        ...mapNewsToStories(validNews, validImages),
        ...mapImagesToStories(validImages),
      ].sort(
        (a, b) =>
          toTimestamp(b.publishedAt, b.publishedAtPretty) -
          toTimestamp(a.publishedAt, a.publishedAtPretty),
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

  private async loadNewsItems(): Promise<NewsItem[]> {
    const news = await lastValueFrom(
      this.http.get<unknown>(`${this.apiBase}/news.json`, {
        params: { search: '__latest__' },
      }),
    );
    return newsItemsSchema.parse(news ?? []);
  }

  // ToDo: add Image previews for the news
  private async loadImageItemsBestEffort(): Promise<ImageItem[]> {
    try {
      const images = await lastValueFrom(
        this.http.get<unknown>(`${this.apiBase}/image.json`, {
          params: { search: '__latest__' },
        }),
      );
      return imageItemsSchema.parse(images ?? []);
    } catch {
      return [];
    }
  }

  getNewsItems(): NewsStoryItem[] {
    return (this.newsStoriesResource.value() ?? []).filter(
      (s) => s.kind === 'news',
    );
  }

  async postNews(info: string): Promise<void> {
    const session = this.auth.session();
    const pincode = this.auth.getEditCredential();
    if (!session || !pincode) throw new EditCredentialError();

    await lastValueFrom(
      this.http.post(`${this.apiBase}/news.json`, {
        badid: session.badId,
        pincode,
        info,
      }),
    );

    this.storiesCache = undefined;
    this.newsStoriesResource.reload();
  }

  async deleteNews(infoId: number): Promise<void> {
    const session = this.auth.session();
    const pincode = this.auth.getEditCredential();
    if (!session || !pincode) throw new EditCredentialError();

    await lastValueFrom(
      this.http.delete(
        `${this.apiBase}/news.json/${session.badId}/${encodeURIComponent(pincode)}/${infoId}`,
      ),
    );

    this.storiesCache = undefined;
    this.newsStoriesResource.reload();
  }
}
