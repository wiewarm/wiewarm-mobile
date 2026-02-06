import { Injectable, effect, inject, signal } from '@angular/core';
import { STORAGE_KEYS, StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(StorageService);

  readonly darkMode = signal(false);

  readonly initialLoad = this.loadFromStorage();
  readonly applyThemeClass = effect(() => {
    document.body.classList.toggle('dark-mode', this.darkMode());
  });

  readonly persistTheme = effect(() => {
    this.storage.write(STORAGE_KEYS.theme, this.darkMode() ? 'dark' : 'light');
  });

  toggle() {
    this.darkMode.update((curr) => !curr);
  }

  private loadFromStorage() {
    const stored = this.storage.read<string>(STORAGE_KEYS.theme);
    if (stored === 'dark') this.darkMode.set(true);
    else if (stored === 'light') this.darkMode.set(false);
  }
}
