import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="icon"
      [attr.role]="label() ? 'img' : null"
      [attr.aria-hidden]="label() ? null : 'true'"
      [attr.aria-label]="label() || null"
    >
      <use [attr.href]="symbolId()"></use>
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-block;
        font-size: inherit;
      }
      .icon {
        width: 1.1em;
        height: 1.1em;
        fill: currentColor;
        vertical-align: -0.24em;
      }
    `,
  ],
})
export class IconComponent {
  readonly symbolId = input.required<string>();
  /** A11y-Label (null = dekorativ) */
  readonly label = input<string | null>(null);
}
