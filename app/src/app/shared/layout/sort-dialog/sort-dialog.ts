import { Component, ViewChild, ElementRef, input, output } from '@angular/core';
import { BadItem } from 'src/app/shared/interfaces/bad-item.interface';
import { DialogDirective } from '../dialog.directive';

@Component({
  selector: 'app-sort-dialog',
  templateUrl: './sort-dialog.html',
  styleUrl: './sort-dialog.scss',
  imports: [DialogDirective],
})
export class SortDialogComponent {
  @ViewChild(DialogDirective) private dialog?: DialogDirective;

  readonly sortField = input.required<keyof BadItem>();
  readonly sortDirection = input.required<'asc' | 'desc'>();

  readonly setSort = output<{
    field: keyof BadItem;
    direction: 'asc' | 'desc';
  }>();

  open() {
    this.dialog?.open();
  }

  close() {
    this.dialog?.close();
  }

  applySort(field: keyof BadItem, direction: 'asc' | 'desc') {
    this.setSort.emit({ field, direction });
    this.close();
  }
}
