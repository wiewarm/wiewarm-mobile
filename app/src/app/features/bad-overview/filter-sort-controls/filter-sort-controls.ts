import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { DialogTriggerDirective } from '../../../shared/directives/dialog-trigger';
import { FilterDialogComponent } from '../../../shared/layout/filter-dialog/filter-dialog';
import { IconComponent } from '../../../shared/layout/icon/icon';
import { SortDialogComponent } from '../../../shared/layout/sort-dialog/sort-dialog';
import type { FilterField } from '../../../shared/util/constants/filter-options';
import { FILTER_FIELDS } from '../../../shared/util/constants/filter-options';
import type {
  SortDirection,
  SortField,
} from '../../../shared/util/constants/sort-options';
import { SORT_FIELDS } from '../../../shared/util/constants/sort-options';

@Component({
  selector: 'app-filter-sort-controls',
  templateUrl: './filter-sort-controls.html',
  styleUrl: './filter-sort-controls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DialogTriggerDirective,
    IconComponent,
    SortDialogComponent,
    FilterDialogComponent,
  ],
})
export class FilterSortControlsComponent {
  readonly sortOption = input.required<SortField>();
  readonly sortDirection = input.required<SortDirection>();
  readonly filterOption = input.required<FilterField>();

  readonly setSort = output<{ field: SortField; direction: SortDirection }>();
  readonly setFilter = output<FilterField>();

  // Todo: replace this pseudo-translation
  readonly SORT_FIELDS = SORT_FIELDS;
  readonly FILTER_FIELDS = FILTER_FIELDS;
}
