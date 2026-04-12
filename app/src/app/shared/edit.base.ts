import { signal } from '@angular/core';
import { EditCredentialError } from './services/bad.service';

export abstract class EditBase {
  readonly loading = signal(false);
  readonly error = signal('');
  readonly success = signal(false);

  protected async save(
    fn: () => Promise<void>,
    defaultErrorMessage = 'Speichern fehlgeschlagen. Bitte erneut versuchen.',
  ): Promise<void> {
    this.error.set('');
    this.success.set(false);
    this.loading.set(true);
    try {
      await fn();
      this.success.set(true);
    } catch (e) {
      this.error.set(
        e instanceof EditCredentialError
          ? 'Sitzung abgelaufen. Bitte erneut anmelden.'
          : defaultErrorMessage,
      );
    } finally {
      this.loading.set(false);
    }
  }
}
