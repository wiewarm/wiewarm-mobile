import { Component, ViewChild, input, output } from '@angular/core';
import { DialogDirective } from '../dialog.directive';
import { FILTER_OPTION_LIST, FilterOption } from '../../util/constants/filter-options';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.html',
  styleUrl: './filter-dialog.scss',
  imports: [DialogDirective],
})
export class FilterDialogComponent {
  @ViewChild(DialogDirective) private dialog?: DialogDirective;

  readonly filterOptions = FILTER_OPTION_LIST;
  readonly filterOption = input.required<FilterOption>();
  readonly setFilter = output<FilterOption>();

  open() {
    this.dialog?.open();
  }

  close() {
    this.dialog?.close();
  }

  applyFilter(option: FilterOption) {
    this.setFilter.emit(option);
    this.close();
  }
}
