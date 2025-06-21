import { Injectable, computed, signal } from '@angular/core';
import { BadItem } from '../interfaces/bad-item.interface';

const STORAGE_KEY = 'favorite';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private _favorite = signal<BadItem | null>(null);

  readonly favorite = computed(() => this._favorite());

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        this._favorite.set(JSON.parse(stored));
      } catch {
        // ignore parse errors
      }
    }
  }

  setFavorite(item: BadItem) {
    this._favorite.set(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(item));
  }

  clearFavorite() {
    this._favorite.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }
}
