import { inject, Injectable, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { BadDetail } from './interfaces/bad-detail.interface';
import type { BadItem } from './interfaces/bad-item.interface';

type CacheEntry<T> = { data: T; ts: number };

@Injectable({ providedIn: 'root' })
export class BadResourceService {
  private readonly http = inject(HttpClient);
  private get apiBase() {
    return environment.apiBase;
  }
  private readonly TTL_MS = 5 * 60_000; // 5 Minutes, then refetch

  private badCache?: CacheEntry<BadItem[]>;
  private readonly detailCache = new Map<string, CacheEntry<BadDetail>>();

  /**
   * Shared resource for the list of all baths.
   * Components can use this to avoid redundant fetching.
   */
  readonly badResource = resource<BadItem[], unknown>({
    loader: () => this.loadList(),
  });

  getDetailResource(id: string) {
    return resource<BadDetail, unknown>({
      loader: () => this.loadDetail(id),
    });
  }

  private isFresh<T>(entry?: CacheEntry<T>): entry is CacheEntry<T> {
    return !!entry && Date.now() - entry.ts <= this.TTL_MS;
  }

  private async loadList(): Promise<BadItem[]> {
    if (this.isFresh(this.badCache)) {
      return this.badCache.data;
    }

    const data = await lastValueFrom(
      this.http.get<BadItem[]>(`${this.apiBase}/temperature/all_current.json/0`)
    );
    this.badCache = { data, ts: Date.now() };
    return data;
  }

  private async loadDetail(id: string): Promise<BadDetail> {
    const key = String(id);
    const cached = this.detailCache.get(key);
    if (this.isFresh(cached)) {
      return cached.data;
    }

    const data = await lastValueFrom(
      this.http.get<BadDetail>(`${this.apiBase}/bad/${key}`)
    );
    this.detailCache.set(key, { data, ts: Date.now() });
    return data;
  }
}
