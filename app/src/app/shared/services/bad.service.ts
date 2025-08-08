import { Injectable, resource } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BadDetail } from './interfaces/bad-detail.interface';
import { BadItem } from './interfaces/bad-item.interface';

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

  // Cache-APIs
  clearCaches(): void {
    this.badCache = undefined;
    this.detailCache.clear();
  }

  refreshAll() {
    this.badCache = undefined;
    return this.getResource();
  }

  refreshDetail(id: string) {
    this.detailCache.delete(String(id));
    return this.getDetailResource(id);
  }

  private isFresh(entry?: CacheEntry<unknown>): boolean {
    return !!entry && Date.now() - entry.ts <= this.TTL_MS;
  }

  private async fetchJson<T>(path: string, signal?: AbortSignal): Promise<T> {
    const res = await fetch(`${this.API_BASE}${path}`, { signal });
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

    const data = await this.fetchJson<BadDetail>(`/bad/${key}`, signal);
    this.detailCache.set(key, { data, ts: Date.now() });
    return data;
  }
}
