import { Component, ViewChild, input, output } from '@angular/core';
import { DialogDirective } from '../dialog.directive';
import {
  SORT_OPTION_LIST,
  SortDirection,
  SortField,
} from '../../util/constants/sort-options';

@Component({
  selector: 'app-sort-dialog',
  templateUrl: './sort-dialog.html',
  styleUrl: './sort-dialog.scss',
  imports: [DialogDirective],
})
export class SortDialogComponent {
  @ViewChild(DialogDirective) private dialog?: DialogDirective;

  readonly sortOptions = SORT_OPTION_LIST;
  readonly sortField = input.required<SortField>();
  readonly sortDirection = input.required<SortDirection>();

  readonly setSort = output<{ field: SortField; direction: SortDirection }>();

  open() {
    this.dialog?.open();
  }

  close() {
    this.dialog?.close();
  }

  applySort(field: SortField, direction: SortDirection) {
    this.setSort.emit({ field, direction });
    this.close();
  }
}
