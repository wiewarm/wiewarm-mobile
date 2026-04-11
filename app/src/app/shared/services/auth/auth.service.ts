import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BadResourceService } from '../bad.service';
import { StorageService, STORAGE_KEYS } from '../storage/storage.service';
import type {
  ActiveAuthGrant,
  PersistedAuthContext,
} from '../interfaces/auth-session.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly badService = inject(BadResourceService);
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

  readonly showLogin = signal(false);

  readonly loading = signal(false);
  readonly error = signal('');

  readonly loginForm = new FormGroup({
    badId: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    pincode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  readonly isLoggedIn = computed(() => !!this.session());

  canEdit(badid: number | undefined): boolean {
    return badid != null && this.session()?.badId === badid;
  }

  getEditCredential(): string | null {
    return this.activeGrant()?.pincode ?? null;
  }

  async openLogin() {
    const badId = await this.getCurrentRouteBadId();
    this.loginForm.reset({ badId });
    this.error.set('');
    this.showLogin.set(true);
  }

  closeLogin() {
    this.showLogin.set(false);
  }

  async login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { badId, pincode } = this.loginForm.getRawValue();
    this.loading.set(true);
    this.error.set('');

    try {
      await lastValueFrom(
        this.http.put(
          `${environment.apiBase}/login/${badId}/${encodeURIComponent(pincode)}`,
          {},
        ),
      );

      this.session.set({ badId: badId! });
      this.activeGrant.set({ pincode });
      this.closeLogin();
    } catch {
      this.error.set('Login fehlgeschlagen. Bitte Daten prüfen.');
    } finally {
      this.loading.set(false);
    }
  }

  logout() {
    this.session.set(null);
    this.activeGrant.set(null);
    this.closeLogin();
  }

  private async getCurrentRouteBadId(): Promise<number | null> {
    const routeBadId = this.currentRouteBadId;

    if (!routeBadId) {
      return null;
    }

    try {
      const detail = await this.badService.getDetail(routeBadId);
      return detail.badid;
    } catch {
      return null;
    }
  }

  private get currentRouteBadId(): string | null {
    let route = this.router.routerState.snapshot.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    return route.paramMap.get('id');
  }
}
