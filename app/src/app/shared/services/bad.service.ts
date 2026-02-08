import { inject, Injectable, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { BadDetail } from './interfaces/bad-detail.interface';
import type { BadItem } from './interfaces/bad-item.interface';
import { CacheEntry, isCacheEntryFresh } from '../util/cache.util';

@Injectable({ providedIn: 'root' })
export class BadResourceService {
  private readonly http = inject(HttpClient);
  private get apiBase() {
    return environment.apiBase;
  }

  private badCache?: CacheEntry<BadItem[]>;
  private readonly detailCache = new Map<string, CacheEntry<BadDetail>>();

  /**
   * Shared resource for the list of all baths.
   * Components can use this to avoid redundant fetching.
   */
  readonly badResource = resource<BadItem[], Error>({
    loader: () => this.loadList(),
  });

  getDetailResource(id: string) {
    return resource<BadDetail, Error>({
      loader: () => this.loadDetail(id),
    });
  }

  private async loadList(): Promise<BadItem[]> {
    if (isCacheEntryFresh(this.badCache)) {
      return this.badCache.data;
    }

    try {
      const data = await lastValueFrom(
        this.http.get<BadItem[]>(`${this.apiBase}/temperature/all_current.json/0`)
      );
      this.badCache = { data, ts: Date.now() };
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Failed to load bad list', { cause: error });
    }
  }

  private async loadDetail(id: string): Promise<BadDetail> {
    const key = String(id);
    const cached = this.detailCache.get(key);
    if (isCacheEntryFresh(cached)) {
      return cached.data;
    }

    try {
      const data = await lastValueFrom(
        this.http.get<BadDetail>(`${this.apiBase}/bad/${key}`)
      );
      this.detailCache.set(key, { data, ts: Date.now() });
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }

      throw new Error(`Failed to load bad detail for id ${key}`, { cause: error });
    }
  }
}
