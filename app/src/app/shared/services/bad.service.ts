import { inject, Injectable, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth/auth.service';
import type {
  BadDetail,
  RawBadDetail,
} from './interfaces/bad-detail.interface';
import type { BadItem } from './interfaces/bad-item.interface';

export class EditCredentialError extends Error {
  constructor() {
    super('no-credential');
  }
}

type CacheEntry<T> = { data: T; ts: number };

@Injectable({ providedIn: 'root' })
export class BadResourceService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

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
      loader: () => this.getDetail(id),
    });
  }

  getDetail(id: string): Promise<BadDetail> {
    return this.loadDetail(id);
  }

  private isFresh<T>(entry?: CacheEntry<T>): entry is CacheEntry<T> {
    return !!entry && Date.now() - entry.ts <= this.TTL_MS;
  }

  private async loadList(): Promise<BadItem[]> {
    if (this.isFresh(this.badCache)) {
      return this.badCache.data;
    }

    const data = await lastValueFrom(
      this.http.get<BadItem[]>(
        `${this.apiBase}/temperature/all_current.json/0`,
      ),
    );
    this.badCache = { data, ts: Date.now() };
    return data;
  }

  /**
   * Partial update: merges fields with cached detail before sending.
   * Throws EditCredentialError when the session has expired.
   */
  async updateBadFields(
    badid: number,
    fields: Record<string, unknown>,
  ): Promise<void> {
    const pincode = this.authService.getEditCredential();
    if (!pincode) throw new EditCredentialError();

    const entry = [...this.detailCache.entries()].find(
      ([, e]) => e.data.badid === badid,
    );
    if (!entry)
      throw new Error('Detail nicht im Cache – bitte Seite neu laden.');
    const [cacheKey, cached] = entry;

    await lastValueFrom(
      this.http.put(`${this.apiBase}/bad`, {
        ...cached.data,
        ...fields,
        badid,
        pincode,
      }),
    );

    this.detailCache.delete(cacheKey);
  }

  private async loadDetail(id: string): Promise<BadDetail> {
    const key = String(id);
    const cached = this.detailCache.get(key);
    if (this.isFresh(cached)) {
      return cached.data;
    }

    const raw = await lastValueFrom(
      this.http.get<RawBadDetail>(`${this.apiBase}/bad/${key}`),
    );
    const data = this.normalizeDetail(raw);
    this.detailCache.set(key, { data, ts: Date.now() });
    return data;
  }

  private normalizeDetail(raw: RawBadDetail): BadDetail {
    return {
      ...raw,
      badid: Number(raw.badid),
      becken:
        raw.becken &&
        Object.fromEntries(
          Object.entries(raw.becken).map(([name, pool]) => [
            name,
            {
              ...pool,
              beckenid: Number(pool.beckenid),
              temp: pool.temp == null ? null : Number(pool.temp),
            },
          ]),
        ),
    };
  }
}
