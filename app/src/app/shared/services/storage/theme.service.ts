import { Injectable, effect, signal } from '@angular/core';
import { StorageService, STORAGE_KEYS } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly darkMode = signal(false);

  constructor(private readonly storage: StorageService) {
    this.loadFromStorage();
    this.applyThemeClass();
    effect(() => {
      this.storage.write(STORAGE_KEYS.theme, this.darkMode() ? 'dark' : 'light');
    });
  }

  toggle() {
    this.darkMode.update((curr) => !curr);
  }

  private loadFromStorage() {
    const stored = this.storage.read<string>(STORAGE_KEYS.theme);
    if (stored === 'dark') this.darkMode.set(true);
    else if (stored === 'light') this.darkMode.set(false);
  }

  private applyThemeClass() {
    effect(() => {
      document.body.classList.toggle('dark-mode', this.darkMode());
    });
  }
}
