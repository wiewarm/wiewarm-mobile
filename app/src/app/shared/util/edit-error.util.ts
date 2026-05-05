import { inject, Injectable } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { EditCredentialError } from '../services/bad.service';
import { ToastService } from '../services/toast.service';

/**
 * Reports a failed edit/save to the user.
 *
 * On `EditCredentialError` (expired session / missing PIN), the session is
 * cleared so the next attempt forces a fresh login — otherwise the UI would
 * look "logged in" while every write keeps failing. All other errors just
 * surface the provided default message.
 */
@Injectable({ providedIn: 'root' })
export class ErrorReporter {
  private readonly toast = inject(ToastService);
  private readonly auth = inject(AuthService);

  report(e: unknown, defaultMessage: string): void {
    if (e instanceof EditCredentialError) {
      this.auth.revokeGrant();
      this.toast.show('Sitzung abgelaufen. Bitte erneut anmelden.');
      return;
    }
    this.toast.show(defaultMessage);
  }
}
