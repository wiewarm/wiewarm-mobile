import { Component, input } from '@angular/core';

type State = 'idle' | 'loading' | 'error';

@Component({
  selector: 'app-loading-error',
  template: `
    @switch (state()) {
      @case ('loading') {
        <p class="status" role="status">⏳ {{ loadingMsg() }}</p>
      }
      @case ('error') {
        <p class="status error" role="alert">❌ {{ errorMsg() }}</p>
      }
    }
  `,
  styles: [
    `
      .status {
        text-align: center;
        padding: 1rem;
      }
      .error {
        color: var(--color-error, #f00);
      }
    `,
  ],
})
export class LoadingErrorComponent {
  readonly state = input<State>('idle');
  readonly loadingMsg = input('Laden…');
  readonly errorMsg = input(
    'Fehler beim Laden. Bitte später erneut versuchen.',
  );
}
