import type { Signal} from '@angular/core';
import { Injectable, signal, computed, effect } from '@angular/core';
import type { BadItem } from './interfaces/bad-item.interface';

const STORAGE_KEY = 'favoriteId';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private favoriteId = signal<string | null>(null);
  private items?: Signal<BadItem[] | null | undefined>;

  readonly favoriteItem: Signal<BadItem | null> = computed(() => {
    const id = this.favoriteId();
    const list = this.items?.() ?? null;
    if (!id || !Array.isArray(list)) return null;
    return list.find((i) => String(i.beckenid) === id) ?? null;
  });

  constructor() {
    // init from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) this.favoriteId.set(stored);
    } catch {
      /* noop */
    }

    // persist changes
    effect(() => {
      const id = this.favoriteId();
      try {
        if (id) localStorage.setItem(STORAGE_KEY, id);
        else localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* noop */
      }
    });
  }

  connect(items: Signal<BadItem[] | null | undefined>) {
    this.items = items;
  }

  setFavorite(itemOrId: BadItem | string) {
    const id =
      typeof itemOrId === 'string' ? itemOrId : String(itemOrId.beckenid);
    this.favoriteId.set(id);
  }

  clearFavorite() {
    this.favoriteId.set(null);
  }

  toggleFavorite(item: BadItem) {
    const id = String(item.beckenid);
    this.favoriteId.update((curr) => (curr === id ? null : id));
  }

  isFavorite(item: BadItem): boolean {
    return this.favoriteId() === String(item.beckenid);
  }
}
