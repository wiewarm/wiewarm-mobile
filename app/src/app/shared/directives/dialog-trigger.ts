import { Directive, ElementRef, inject, input } from '@angular/core';

type DialogTarget = HTMLDialogElement | { open: () => void };

@Directive({
  selector: 'a[appDialogTrigger],button[appDialogTrigger]',
  host: {
    'attr.aria-haspopup': 'dialog',
    '[attr.href]': 'isAnchor ? "#" : null',
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
    if (targetDialog instanceof HTMLDialogElement && !targetDialog.open) {
      targetDialog.showModal();
      return;
    }

    if (!(targetDialog instanceof HTMLDialogElement)) {
      targetDialog.open();
    }
  }
}
