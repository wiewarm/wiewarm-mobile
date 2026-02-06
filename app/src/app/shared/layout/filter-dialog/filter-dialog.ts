import {
  Component,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import type { FilterField } from '../../util/constants/filter-options';
import {
  FILTER_OPTION_LIST
} from '../../util/constants/filter-options';

@Component({
  selector: 'dialog[app-filter-dialog]',
  templateUrl: './filter-dialog.html',
  styleUrl: './filter-dialog.scss',
  host: {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'filter-dialog-title',
    tabindex: '-1',
    class: 'filter-dialog',
  },
})
export class FilterDialogComponent {
  private readonly elRef = inject(ElementRef<HTMLDialogElement>);

  readonly filterOptions = FILTER_OPTION_LIST;
  readonly filterField = input.required<FilterField>();
  readonly setFilter = output<FilterField>();

  open() {
    this.elRef.nativeElement.showModal();
  }

  close() {
    this.elRef.nativeElement.close();
  }

  applyFilter(option: FilterField) {
    this.setFilter.emit(option);
    this.close();
  }
}
