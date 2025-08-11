import { CdkAccordionModule } from '@angular/cdk/accordion';
import {
  ScrollingModule,
  VIRTUAL_SCROLL_STRATEGY,
} from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadResourceService } from 'src/app/shared/services/bad.service';
import { SortDialogComponent } from 'src/app/shared/layout/sort-dialog/sort-dialog';
import { BadItemComponent } from './bad-item/bad-item';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { isThisYear } from 'src/app/shared/util/date.util';
import { FilterDialogComponent } from 'src/app/shared/layout/filter-dialog/filter-dialog';
import {
  FilterField,
  FILTER_FIELDS,
} from './../../shared/util/constants/filter-options';
import {
  SORT_FIELDS,
  SortDirection,
  SortField,
} from 'src/app/shared/util/constants/sort-options';
import { FavoriteItemComponent } from './favorite-item/favorite-item';
import {
  ADAPTIVE_VS_CONFIG,
  AdaptiveVirtualScrollStrategy,
} from 'src/app/shared/layout/virtual-scroll/adaptive-virtual-scroll.strategy';
import { filterItems, sortItems } from 'src/app/shared/util/list.util';

@Component({
  selector: 'main[app-bad-overview]',
  templateUrl: './bad-overview.html',
  styleUrl: './bad-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    CdkAccordionModule,
    ScrollingModule,
    SortDialogComponent,
    FilterDialogComponent,
    BadItemComponent,
    FavoriteItemComponent,
  ],
  host: {
    role: 'main', // a11y: Landmark Rolle
    class: 'bad-overview',
  },
  providers: [
    {
      provide: ADAPTIVE_VS_CONFIG,
      useValue: {
        mobile: { itemSize: 81 },
        desktop: { itemSize: 52 },
        factorMin: 7,
        factorMax: 14,
      },
    },
    {
      provide: VIRTUAL_SCROLL_STRATEGY,
      useClass: AdaptiveVirtualScrollStrategy,
    },
  ],
})
export class BadOverviewComponent {
  constructor(
    private detailService: BadResourceService,
    private favoriteService: FavoriteService
  ) {
    this.favoriteService.connect(computed(() => this.badResource.value()));
  }

  readonly badResource = this.detailService.getResource();
  readonly favorite = this.favoriteService.favoriteItem;

  searchInput = signal('');

  sortField = signal<SortField>('kanton');
  sortDirection = signal<SortDirection>('asc');
  sortFieldLabel = computed(() => SORT_FIELDS[this.sortField()]);

  filterOption = signal<FilterField>('aktuell');
  filterOptionLabel = computed(() => FILTER_FIELDS[this.filterOption()]);

  setFilter(option: FilterField) {
    this.filterOption.set(option);
  }

  setSort(field: SortField, direction: SortDirection = 'asc') {
    this.sortField.set(field);
    this.sortDirection.set(direction);
  }

  filteredItems = computed(() => {
    const items = this.badResource.value() ?? [];
    const term = this.searchInput().toLowerCase();
    let out = filterItems(items, term, ['bad', 'ort', 'becken']);
    if (this.filterOption() === 'aktuell') {
      out = out.filter((i) => isThisYear(i.date || null));
    }
    return sortItems(out, this.sortField(), this.sortDirection());
  });
}
