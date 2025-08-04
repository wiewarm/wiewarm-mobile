import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDialog]',
})
export class DialogDirective {
  constructor(private elementRef: ElementRef<HTMLDialogElement>) {}

  open() {
    this.elementRef.nativeElement.showModal();
  }

  close() {
    this.elementRef.nativeElement.close();
  }
}