import { Component, ViewChild, ElementRef, input, output } from '@angular/core';
import { DialogDirective } from '../dialog.directive';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.html',
  styleUrl: './filter-dialog.scss',
  imports: [DialogDirective],
})
export class FilterDialogComponent {
  @ViewChild(DialogDirective) private dialog?: DialogDirective;

  readonly filterOption = input.required<'aktuell' | 'all'>();
  readonly setFilter = output<'aktuell' | 'all'>();

  open() {
    this.dialog?.open();
  }

  close() {
    this.dialog?.close();
  }

  applyFilter(option: 'aktuell' | 'all') {
    this.setFilter.emit(option);
    this.close();
  }
}
