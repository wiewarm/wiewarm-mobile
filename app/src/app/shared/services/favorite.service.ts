import { Injectable, Signal, computed, effect, signal } from '@angular/core';
import { BadItem } from '../interfaces/bad-item.interface';

const STORAGE_KEY = 'favorite';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private favorite = signal<BadItem | null>(null);

  readonly favoriteSignal = computed(() => this.favorite());

  constructor() {
    this.loadFavoriteFromLocalStorage();
  }

  setFavorite(item: BadItem): void {
    this.favorite.set(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(item));
  }

  clearFavorite(): void {
    this.favorite.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  connect(items: Signal<BadItem[] | null | undefined>): void {
    effect(() => {
      const currentFavorite = this.favorite();
      const itemList = items();

      if (!currentFavorite || !itemList) {
        return;
      }

      const updatedFavorite = itemList.find(
        (item) => item.beckenid === currentFavorite.beckenid
      );

      if (
        updatedFavorite &&
        (updatedFavorite.date !== currentFavorite.date ||
          updatedFavorite.temp !== currentFavorite.temp)
      ) {
        this.setFavorite(updatedFavorite);
      }
    });
  }

  private loadFavoriteFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.favorite.set(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse favorite from local storage:', e);
    }
  }
}
