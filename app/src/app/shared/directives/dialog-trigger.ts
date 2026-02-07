import { Directive, ElementRef, inject, input } from '@angular/core';

type DialogTarget = HTMLDialogElement | { open: () => void };

/**
 * Directive that triggers the opening of a native dialog element when clicked.
 *
 * @example
 * ```html
 * <button [appDialogTrigger]="myDialog">Open Dialog</button>
 * <dialog #myDialog>...</dialog>
 * ```
 *
 * @see HTMLDialogElement
 */
@Directive({
  selector: 'a[appDialogTrigger],button[appDialogTrigger]',
  host: {
    'attr.aria-haspopup': 'dialog',
    '(click)': 'onClick($event)',
  },
})
export class DialogTriggerDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  protected readonly isAnchor = this.elementRef.nativeElement.tagName === 'A';

  readonly dialog = input.required<DialogTarget>({
    alias: 'appDialogTrigger',
  });

  onClick(event: Event) {
    event.preventDefault();

    const targetDialog = this.dialog();
    if (targetDialog instanceof HTMLDialogElement) {
      if (targetDialog.open) {
        // If the dialog is already open, focus it instead of reopening
        targetDialog.focus();
        return;
      }
      targetDialog.showModal();
      return;
    }
    targetDialog.open();
  }
}
