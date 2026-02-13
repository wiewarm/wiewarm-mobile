import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-close-button',
  template: `<button
    type="button"
    class="close-button"
    (click)="close()"
    [attr.aria-label]="'Schliessen'"
  >
    <span aria-hidden="true">&#10060;</span>
  </button> `,
  styleUrl: './close-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloseButtonComponent {
  readonly closed = output<void>();
  readonly close = () => this.closed.emit();
}
