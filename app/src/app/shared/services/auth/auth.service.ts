import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService, STORAGE_KEYS } from '../storage/storage.service';
import type {
  ActiveAuthGrant,
  PersistedAuthContext,
} from '../interfaces/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);

  /** Persisted to localStorage – used for UI/permission display across reloads. */
  readonly session = signal<PersistedAuthContext | null>(
    this.storage.read<PersistedAuthContext>(STORAGE_KEYS.auth),
  );

  /** Held only in memory – cleared on reload, user must re-authenticate to edit. */
  private readonly activeGrant = signal<ActiveAuthGrant | null>(null);

  readonly persistSession = effect(() => {
    const s = this.session();
    if (s) {
      this.storage.write(STORAGE_KEYS.auth, s);
    } else {
      this.storage.remove(STORAGE_KEYS.auth);
    }
  });

  readonly isLoggedIn = computed(() => !!this.session());

  readonly hasActiveGrant = computed(() => !!this.activeGrant());

  canEdit(badid: number | undefined): boolean {
    return badid != null && this.session()?.badId === badid && this.hasActiveGrant();
  }

  getEditCredential(): string | null {
    return this.activeGrant()?.pincode ?? null;
  }

  /** Authenticates against the API. Throws on failure — caller handles UI state. */
  async doLogin(badId: number, pincode: string): Promise<void> {
    await lastValueFrom(
      this.http.put(
        `${environment.apiBase}/login/${badId}/${encodeURIComponent(pincode)}`,
        {},
      ),
    );
    this.session.set({ badId });
    this.activeGrant.set({ pincode });
  }

  logout() {
    this.session.set(null);
    this.activeGrant.set(null);
  }
}
