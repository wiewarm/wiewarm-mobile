import { inject, signal } from '@angular/core';
import { EditCredentialError } from './services/bad.service';
import { ToastService } from './services/toast.service';

export abstract class EditBase {
  private readonly toast = inject(ToastService);

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
      this.toast.show(
        e instanceof EditCredentialError
          ? 'Sitzung abgelaufen. Bitte erneut anmelden.'
          : defaultErrorMessage,
      );
    } finally {
      this.loading.set(false);
    }
  }
}
