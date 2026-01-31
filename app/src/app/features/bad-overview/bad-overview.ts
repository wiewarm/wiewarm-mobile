import { CdkAccordionModule } from '@angular/cdk/accordion';
import {
  ScrollingModule,
  VIRTUAL_SCROLL_STRATEGY,
} from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadResourceService } from 'src/app/shared/services/bad.service';
import { SortDialogComponent } from 'src/app/shared/layout/sort-dialog/sort-dialog';
import { BadItemComponent } from './bad-item/bad-item';
import { FavoriteService } from 'src/app/shared/services/storage/favorite.service';
import { ListPreferencesService } from 'src/app/shared/services/storage/list-preferences.service';
import { isThisYear } from 'src/app/shared/util/date.util';
import { FilterDialogComponent } from 'src/app/shared/layout/filter-dialog/filter-dialog';
import type { FilterField } from './../../shared/util/constants/filter-options';
import { FILTER_FIELDS } from './../../shared/util/constants/filter-options';
import type {
  SortDirection,
  SortField,
} from 'src/app/shared/util/constants/sort-options';
import { SORT_FIELDS } from 'src/app/shared/util/constants/sort-options';
import { FavoriteItemComponent } from './favorite-item/favorite-item';
import {
  ADAPTIVE_VS_CONFIG,
  AdaptiveVirtualScrollStrategy,
} from 'src/app/shared/layout/virtual-scroll/adaptive-virtual-scroll.strategy';
import { filterItems, sortItems } from 'src/app/shared/util/list.util';
import { LoadingErrorComponent } from '../../shared/layout/loading-error/loading-error.component';
import { IconComponent } from 'src/app/shared/layout/icon/icon';

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
    LoadingErrorComponent,
    IconComponent,
  ],
  host: {
    role: 'main', // a11y
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
  private readonly favoriteService = inject(FavoriteService);
  private readonly detailService = inject(BadResourceService);
  private readonly listPreferences = inject(ListPreferencesService);

  readonly badResource = this.detailService.getResource();
  readonly favorites = this.favoriteService.favoriteItems;

  constructor() {
    this.favoriteService.connect(computed(() => this.badResource.value()));
  }

  searchInput = signal('');

  readonly sortField = this.listPreferences.sortField;
  readonly sortDirection = this.listPreferences.sortDirection;
  readonly filterOption = this.listPreferences.filterField;
  readonly SORT_FIELDS = SORT_FIELDS;
  readonly FILTER_FIELDS = FILTER_FIELDS;

  setFilter(option: FilterField) {
    this.listPreferences.setFilter(option);
  }

  setSort(field: SortField, direction: SortDirection = 'asc') {
    this.listPreferences.setSort(field, direction);
  }

  filteredItems = computed(() => {
    let out = filterItems(
      this.badResource.value() ?? [],
      this.searchInput().toLowerCase(),
      ['bad', 'ort', 'becken'],
    );
    if (this.filterOption() === 'aktuell') {
      out = out.filter((i) => isThisYear(i.date || null));
    }
    return sortItems(out, this.sortField(), this.sortDirection());
  });
}
