import { Component, ElementRef, inject, input, output } from '@angular/core';
import { CloseButtonComponent } from '../close-button/close-button.component';
import type {
  SortDirection,
  SortField,
} from '../../util/constants/sort-options';
import { SORT_OPTION_LIST } from '../../util/constants/sort-options';

@Component({
  selector: 'dialog[app-sort-dialog]',
  templateUrl: './sort-dialog.html',
  styleUrl: './sort-dialog.scss',
  imports: [CloseButtonComponent],
  host: {
    'aria-modal': 'true',
    'aria-labelledby': 'sort-dialog-title',
  },
})
export class SortDialogComponent {
  private readonly elementRef = inject(ElementRef<HTMLDialogElement>);

  readonly sortOptions = SORT_OPTION_LIST;
  readonly sortField = input.required<SortField>();
  readonly sortDirection = input.required<SortDirection>();

  readonly setSort = output<{ field: SortField; direction: SortDirection }>();

  readonly open = () => this.elementRef.nativeElement.showModal();
  readonly close = () => this.elementRef.nativeElement.close();

  applySort(field: SortField, direction: SortDirection) {
    this.setSort.emit({ field, direction });
    this.close();
  }
}
