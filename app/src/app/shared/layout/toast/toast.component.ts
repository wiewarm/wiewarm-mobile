import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
} from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast--' + toast.type" role="alert">
          <span class="toast-message">{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { popover: 'manual' },
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    effect(() => {
      const hasToasts = this.toastService.toasts().length > 0;
      const host = this.el.nativeElement;

      if (hasToasts && !host.matches(':popover-open')) {
        host.showPopover();
      } else if (!hasToasts && host.matches(':popover-open')) {
        host.hidePopover();
      }
    });
  }
}