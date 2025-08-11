import {
  Component,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import {
  SORT_OPTION_LIST,
  SortDirection,
  SortField,
} from '../../util/constants/sort-options';

@Component({
  selector: 'dialog[app-sort-dialog]',
  templateUrl: './sort-dialog.html',
  styleUrl: './sort-dialog.scss',
  host: {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'sort-dialog-title',
    tabindex: '-1',
    class: 'sort-dialog',
  },
})
export class SortDialogComponent {
  private elementRef = inject(ElementRef<HTMLDialogElement>);

  readonly sortOptions = SORT_OPTION_LIST;
  readonly sortField = input.required<SortField>();
  readonly sortDirection = input.required<SortDirection>();

  readonly setSort = output<{ field: SortField; direction: SortDirection }>();

  open() {
    this.elementRef.nativeElement.showModal();
  }

  close() {
    this.elementRef.nativeElement.close();
  }

  applySort(field: SortField, direction: SortDirection) {
    this.setSort.emit({ field, direction });
    this.close();
  }
}
