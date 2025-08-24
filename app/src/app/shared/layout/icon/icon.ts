import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `
    <svg
      class="icon"
      [attr.role]="label() ? 'img' : null"
      [attr.aria-hidden]="label() ? null : 'true'"
      [attr.aria-label]="label() || null"
    >
      <use [attr.href]="'assets/icons/sprite.svg#'+symbolId()"></use>
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-block;
        font-size: inherit;
      }
      .icon {
        width: 1em;
        height: 1em;
        fill: currentColor;
      }
    `,
  ],
})
export class IconComponent {
  readonly symbolId = input.required<string>();
  /** A11y: Label */
  readonly label = input<string | null>(null);
}
