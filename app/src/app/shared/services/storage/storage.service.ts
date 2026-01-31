import { Injectable } from '@angular/core';

export const STORAGE_KEYS = {
  favorites: 'favoriteIds',
  legacyFavorite: 'favoriteId',
  theme: 'themeMode',
  list: 'listPreferences',
} as const;

@Injectable({ providedIn: 'root' })
export class StorageService {
  read<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  write<T>(key: string, value: T) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* noop */
    }
  }

  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* noop */
    }
  }

}
