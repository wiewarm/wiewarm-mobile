import { Injectable, signal, Signal, computed, effect } from '@angular/core';
import { BadItem } from '../interfaces/bad-item.interface';

const STORAGE_KEY = 'favorite';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private favorite = signal<BadItem | null>(null);
  readonly favoriteSignal: Signal<BadItem | null> = computed(() =>
    this.favorite()
  );

  constructor() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) this.favorite.set(JSON.parse(stored));
    } catch {
      console.warn('Error reading favorite from localStorage');
    }
  }

  setFavorite(item: BadItem): void {
    const clone = structuredClone(item) as BadItem;
    this.favorite.set(clone);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clone));
  }

  clearFavorite(): void {
    this.favorite.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  connect(items: Signal<BadItem[] | null | undefined>): void {
    effect(() => {
      const fav = this.favorite();
      const updated = items()?.find((i) => i.beckenid === fav?.beckenid);
      if (
        fav &&
        updated &&
        (updated.date !== fav.date || updated.temp !== fav.temp)
      ) {
        this.setFavorite(updated);
      }
    });
  }
}
