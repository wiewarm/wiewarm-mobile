import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-edit-feedback',
  template: `@if (error()) {
      <p class="error" role="alert">❌ {{ error() }}</p>
    }
    @if (success()) {
      <p class="success" role="status">💾 Gespeichert.</p>
    }`,
  styleUrl: './edit-feedback.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-edit-feedback' },
})
export class EditFeedbackComponent {
  readonly error = input('');
  readonly success = input(false);
}
