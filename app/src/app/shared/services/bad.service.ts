import { Injectable, resource } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { BadDetail } from './interfaces/bad-detail.interface';
import type { BadImage } from './interfaces/bad-image.interface';
import type { BadItem } from './interfaces/bad-item.interface';

type CacheEntry<T> = { data: T; ts: number };

@Injectable({ providedIn: 'root' })
export class BadResourceService {
  private readonly API_BASE = environment.apiBase;
  private readonly TTL_MS = 5 * 60_000; // 5 Minutes

  private badCache?: CacheEntry<BadItem[]>;
  private readonly detailCache = new Map<string, CacheEntry<BadDetail>>();

  getResource() {
    return resource<BadItem[], unknown>({
      loader: ({ abortSignal }) => this.loadList(abortSignal),
    });
  }

  getDetailResource(id: string) {
    return resource<BadDetail, unknown>({
      loader: ({ abortSignal }) => this.loadDetail(id, abortSignal),
    });
  }

  private isFresh(entry?: CacheEntry<unknown>): boolean {
    return !!entry && Date.now() - entry.ts <= this.TTL_MS;
  }

  private async fetchJson<T>(
    base: string,
    path: string,
    signal?: AbortSignal
  ): Promise<T> {
    const res = await fetch(`${base}${path}`, { signal });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText || ''}`.trim());
    }
    return res.json() as Promise<T>;
  }

  private async loadList(signal?: AbortSignal): Promise<BadItem[]> {
    if (this.isFresh(this.badCache)) {
      return this.badCache!.data;
    }

    const data = await this.fetchJson<BadItem[]>(
      this.API_BASE,
      '/temperature/all_current.json/0',
      signal
    );
    this.badCache = { data, ts: Date.now() };
    return data;
  }

  private async loadDetail(
    id: string,
    signal?: AbortSignal
  ): Promise<BadDetail> {
    const key = String(id);
    const cached = this.detailCache.get(key);
    if (this.isFresh(cached)) {
      return cached!.data;
    }

    const data = await this.fetchJson<BadDetail>(
      this.API_BASE,
      `/bad/${key}`,
      signal
    );
    this.detailCache.set(key, { data, ts: Date.now() });
    return data;
  }
}
