import { CdkAccordionModule } from '@angular/cdk/accordion';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BadItem } from 'src/app/shared/services/interfaces/bad-item.interface';
import { BadResourceService } from 'src/app/shared/services/bad.service';
import { temperatureClass } from 'src/app/shared/util/temperature.util';
import { SortDialogComponent } from 'src/app/shared/layout/sort-dialog/sort-dialog';
import { BadItemComponent } from './bad-item/bad-item';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { isThisYear } from 'src/app/shared/util/date.util';
import { FilterDialogComponent } from 'src/app/shared/layout/filter-dialog/filter-dialog';
import {
  FILTER_OPTIONS,
  FilterOption,
} from 'src/app/shared/util/constants/filter-options';
import {
  SORT_FIELDS,
  SortDirection,
  SortField,
} from 'src/app/shared/util/constants/sort-options';

@Component({
  selector: 'app-bad-overview',
  templateUrl: './bad-overview.html',
  styleUrl: './bad-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    CdkAccordionModule,
    ScrollingModule,
    RouterModule,
    SortDialogComponent,
    FilterDialogComponent,
    BadItemComponent,
  ],
})
export class BadOverviewComponent {
  temperatureClass = temperatureClass;

  constructor(
    private detailService: BadResourceService,
    private favoriteService: FavoriteService
  ) {
    this.favoriteService.connect(computed(() => this.badResource.value()));
  }

  readonly badResource = this.detailService.getResource();
  readonly favorite = this.favoriteService.favoriteSignal;

  searchInput = signal('');

  sortField = signal<SortField>('kanton');
  sortDirection = signal<SortDirection>('asc');
  sortFieldLabel = computed(() => SORT_FIELDS[this.sortField()]);

  filterOption = signal<FilterOption>('aktuell');
  filterOptionLabel = computed(() => FILTER_OPTIONS[this.filterOption()]);

  setFilter(option: FilterOption) {
    this.filterOption.set(option);
  }

  setSort(field: SortField, direction: SortDirection = 'asc') {
    this.sortField.set(field);
    this.sortDirection.set(direction);
  }

  filteredItems = computed(() => {
    const term = this.searchInput().toLowerCase();
    const items = this.badResource.value() ?? [];
    let filtered = term ? this.filterItems(items, term) : items;
    // Custom behavior for specific filter option
    if (this.filterOption() === 'aktuell') {
      filtered = filtered.filter((item) => isThisYear(item.date || null));
    }
    return this.sortItems(filtered, this.sortField(), this.sortDirection());
  });

  private filterItems(items: BadItem[], term: string): BadItem[] {
    return items.filter((item) => {
      const searchFields = [item.bad, item.ort, item.becken]
        .filter(Boolean)
        .map((val) => val.toLowerCase());
      return searchFields.some((field) => field.includes(term));
    });
  }

  private sortItems(
    items: BadItem[],
    field: keyof BadItem,
    direction: 'asc' | 'desc'
  ): BadItem[] {
    return [...items].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const comparison = String(aVal).localeCompare(String(bVal), undefined, {
        numeric: true,
        sensitivity: 'base',
      });

      return direction === 'asc' ? comparison : -comparison;
    });
  }
}
