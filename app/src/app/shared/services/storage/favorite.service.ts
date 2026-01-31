import type { Signal} from '@angular/core';
import { Injectable, signal, computed, effect } from '@angular/core';
import type { BadItem } from '../interfaces/bad-item.interface';
import { StorageService, STORAGE_KEYS } from './storage.service';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private favoriteIds = signal<string[]>([]);
  private items?: Signal<BadItem[] | null | undefined>;

  readonly favoriteItems: Signal<BadItem[]> = computed(() => {
    const ids = new Set(this.favoriteIds());
    const list = this.items?.() ?? null;
    if (!Array.isArray(list) || ids.size === 0) return [];
    return list.filter((i) => ids.has(String(i.beckenid)));
  });

  // Backward-compatible single favorite (first match)
  readonly favoriteItem: Signal<BadItem | null> = computed(() => {
    const list = this.favoriteItems();
    return list.length > 0 ? list[0] : null;
  });

  constructor(private readonly storage: StorageService) {
    this.initializeFromStorage();
    effect(() => {
      const ids = this.favoriteIds();
      if (ids.length > 0) this.storage.write(STORAGE_KEYS.favorites, ids);
      else this.storage.remove(STORAGE_KEYS.favorites);
    });
  }

  connect(items: Signal<BadItem[] | null | undefined>) {
    this.items = items;
  }

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
      curr.includes(id) ? curr.filter((v) => v !== id) : [...curr, id]
    );
  }

  isFavorite(item: BadItem): boolean {
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
    if (!Array.isArray(stored)) return [];
    return stored.map(String);
  }

  private migrateLegacyId() {
    // Legacy format: single favorite ID stored under `favoriteId`
    const legacy = this.storage.read<string>(STORAGE_KEYS.legacyFavorite);
    if (!legacy) return;
    this.favoriteIds.set([String(legacy)]);
    this.storage.remove(STORAGE_KEYS.legacyFavorite);
  }
}
