import { inject, Injectable, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth/auth.service';
import type { BadDetail } from './interfaces/bad-detail.interface';
import type { BadItem } from './interfaces/bad-item.interface';
import type { CacheEntry } from '../util/cache.util';
import { isCacheEntryFresh } from '../util/cache.util';
import { badDetailSchema, badItemsSchema } from './schemas/bad.schema';

export class EditCredentialError extends Error {
  constructor() {
    super('no-credential');
  }
}

@Injectable({ providedIn: 'root' })
export class BadResourceService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private get apiBase() {
    return environment.apiBase;
  }

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

  private async loadList(): Promise<BadItem[]> {
    if (isCacheEntryFresh(this.badCache)) {
      return this.badCache.data;
    }

    const raw = await lastValueFrom(
      this.http.get<unknown>(`${this.apiBase}/temperature/all_current.json/0`),
    );
    const data = badItemsSchema.parse(raw);
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
    const [, cached] = entry;

    await lastValueFrom(
      this.http.put(`${this.apiBase}/bad`, {
        ...cached.data,
        ...fields,
        badid,
        pincode,
      }),
    );

    // Delete all cache entries for this bad — there may be multiple keys
    // (e.g. slug and numeric id) pointing to the same record.
    for (const [key, e] of [...this.detailCache.entries()]) {
      if (e.data.badid === badid) {
        this.detailCache.delete(key);
      }
    }
  }

  private async loadDetail(id: string): Promise<BadDetail> {
    const key = String(id);
    const cached = this.detailCache.get(key);
    if (isCacheEntryFresh(cached)) {
      return cached.data;
    }

    const raw = await lastValueFrom(
      this.http.get<unknown>(`${this.apiBase}/bad/${key}`),
    );
    const data = badDetailSchema.parse(raw);
    this.detailCache.set(key, { data, ts: Date.now() });
    return data;
  }
}
