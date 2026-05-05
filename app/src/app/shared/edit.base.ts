import { inject, signal } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { ErrorReporter } from './util/edit-error.util';

export abstract class EditBase {
  private readonly errorReporter = inject(ErrorReporter);
  protected readonly auth = inject(AuthService);

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
      this.errorReporter.report(e, defaultErrorMessage);
    } finally {
      this.loading.set(false);
    }
  }
}
