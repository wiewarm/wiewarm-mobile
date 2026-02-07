import { CdkAccordionModule } from '@angular/cdk/accordion';
import type { ResourceRef } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterDialogComponent } from '../../shared/layout/filter-dialog/filter-dialog';
import { IconComponent } from '../../shared/layout/icon/icon';
import { LoadingErrorComponent } from '../../shared/layout/loading-error/loading-error';
import { SortDialogComponent } from '../../shared/layout/sort-dialog/sort-dialog';
import { DialogTriggerDirective } from '../../shared/directives/dialog-trigger';
import { BadResourceService } from '../../shared/services/bad.service';
import type { BadItem } from '../../shared/services/interfaces/bad-item.interface';
import { FavoriteService } from '../../shared/services/storage/favorite.service';
import { ListPreferencesService } from '../../shared/services/storage/list-preferences.service';
import type {
  SortDirection,
  SortField,
} from '../../shared/util/constants/sort-options';
import { SORT_FIELDS } from '../../shared/util/constants/sort-options';
import { isThisYear } from '../../shared/util/date.util';
import { filterItems, sortItems } from '../../shared/util/list.util';
import type { FilterField } from './../../shared/util/constants/filter-options';
import { FILTER_FIELDS } from './../../shared/util/constants/filter-options';
import { BadItemComponent } from './bad-item/bad-item';
import { FavoriteItemComponent } from './favorite-item/favorite-item';

@Component({
  selector: 'main[app-bad-overview]',
  templateUrl: './bad-overview.html',
  styleUrl: './bad-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    CdkAccordionModule,
    SortDialogComponent,
    FilterDialogComponent,
    BadItemComponent,
    FavoriteItemComponent,
    LoadingErrorComponent,
    IconComponent,
    DialogTriggerDirective,
  ],
  host: {
    role: 'main', // a11y
    class: 'bad-overview',
  },
})
export class BadOverviewComponent {
  private readonly badService = inject(BadResourceService);
  private readonly listPreferences = inject(ListPreferencesService);
  readonly favoriteService = inject(FavoriteService);

  readonly badResource: ResourceRef<BadItem[] | undefined> =
    this.badService.badResource;
  readonly favorites = this.favoriteService.favoriteItems;

  readonly searchInput = signal('');

  readonly sortOption = this.listPreferences.sortField;
  readonly sortDirection = this.listPreferences.sortDirection;
  readonly filterOption = this.listPreferences.filterField;

  readonly SORT_FIELDS = SORT_FIELDS;
  readonly FILTER_FIELDS = FILTER_FIELDS;

  readonly filteredItems = computed(() => {
    const rawItems: BadItem[] = this.badResource.value() ?? [];
    const searchTerm = this.searchInput().toLowerCase();
    const currentFilter = this.filterOption();

    let out: BadItem[] = filterItems<BadItem>(rawItems, searchTerm, [
      'bad',
      'ort',
      'becken',
    ]);

    if (currentFilter === 'aktuell') {
      out = out.filter((item) => isThisYear(item.date || null));
    }

    return sortItems<BadItem>(
      out,
      this.sortOption() as keyof BadItem,
      this.sortDirection(),
    );
  });

  setFilter(option: FilterField) {
    this.listPreferences.setFilter(option);
  }

  setSort(field: SortField, direction: SortDirection = 'asc') {
    this.listPreferences.setSort(field, direction);
  }
}
