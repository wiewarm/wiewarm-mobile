import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-error',
  standalone: true,
  template: `
    @if (isLoading()) {
    <div class="status" role="status" aria-live="polite">
      <span aria-hidden="true">⏳</span>
      <p>{{ loadingMessage() }}</p>
    </div>
    } @else if (error()) {
    <div class="status error" role="alert" aria-live="assertive">
      <span aria-hidden="true">❌</span>
      <p>{{ errorMessage() }}</p>
    </div>
    }
  `,
  styles: [
    `
      .status {
        text-align: center;
        padding: 1rem;
      }
      .error {
        color: var(--color-error, #ff0000);
      }
    `,
  ],
})
export class LoadingErrorComponent {
  isLoading = input(false);
  error = input<unknown | null>(null);

  loadingMessage = input('Laden…');
  errorMessage = input('Fehler beim Laden. Bitte später erneut versuchen.');
}
