import { inject, Injectable, signal, computed, effect } from '@angular/core';
import { BadResourceService } from '../bad.service';
import { StorageService, STORAGE_KEYS } from './storage.service';
import type { BadItem } from '../interfaces/bad-item.interface';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private readonly storage = inject(StorageService);
  private readonly badService = inject(BadResourceService);
  private readonly favoriteIds = signal<string[]>([]);

  readonly initialLoad = this.initializeFromStorage();
  readonly persistFavorite = effect(() => {
    const ids = this.favoriteIds();
    if (ids.length > 0) {
      this.storage.write(STORAGE_KEYS.favorites, ids);
    } else {
      this.storage.remove(STORAGE_KEYS.favorites);
    }
  });

  readonly favoriteItems = computed(() => {
    const ids = new Set(this.favoriteIds());
    const list = this.badService.badResource.value() ?? [];
    if (ids.size === 0 || list.length === 0) return [];
    return list.filter((item) => ids.has(String(item.beckenid)));
  });

  readonly favoriteItem = computed(() => {
    const list = this.favoriteItems();
    return list.length > 0 ? list[0] : null;
  });

  setFavorite(itemOrId: BadItem | string) {
    const id =
      typeof itemOrId === 'string' ? itemOrId : String(itemOrId.beckenid);
    this.favoriteIds.set([id]);
  }

  clearFavorite() {
    this.favoriteIds.set([]);
  }

  toggleFavorite(item: BadItem) {
    const id = String(item.beckenid);
    this.favoriteIds.update((curr) =>
      curr.includes(id) ? curr.filter((v) => v !== id) : [...curr, id],
    );
  }

  isFavorite(item: BadItem | null | undefined): boolean {
    if (!item) return false;
    return this.favoriteIds().includes(String(item.beckenid));
  }

  private initializeFromStorage() {
    const current = this.loadCurrentIds();
    if (current.length > 0) {
      this.favoriteIds.set(current);
      return;
    }
    this.migrateLegacyId();
  }

  private loadCurrentIds(): string[] {
    const stored = this.storage.read<unknown>(STORAGE_KEYS.favorites);
    return Array.isArray(stored) ? stored.map(String) : [];
  }

  private migrateLegacyId() {
    // Legacy format: single favorite ID stored under `favoriteId`
    const legacy = this.storage.read<string>(STORAGE_KEYS.legacyFavorite);
    if (!legacy) return;
    this.favoriteIds.set([String(legacy)]);
    this.storage.remove(STORAGE_KEYS.legacyFavorite);
  }
}
