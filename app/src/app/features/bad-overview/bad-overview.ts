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

import { LoadingErrorComponent } from '../../shared/layout/loading-error/loading-error';
import { BadResourceService } from '../../shared/services/bad.service';
import type { BadItem } from '../../shared/services/interfaces/bad-item.interface';
import { FavoriteService } from '../../shared/services/storage/favorite.service';
import { ListPreferencesService } from '../../shared/services/storage/list-preferences.service';
import { isThisYear } from '../../shared/util/date.util';
import { filterItems, sortItems } from '../../shared/util/list.util';

import { BadItemComponent } from './bad-item/bad-item';
import { FilterSortControlsComponent } from './filter-sort-controls/filter-sort-controls';
import { FavoriteItemComponent } from './favorite-item/favorite-item';

@Component({
  selector: 'main[app-bad-overview]',
  templateUrl: './bad-overview.html',
  styleUrl: './bad-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    CdkAccordionModule,
    BadItemComponent,
    FilterSortControlsComponent,
    FavoriteItemComponent,
    LoadingErrorComponent,
  ],
  host: { role: 'main', class: 'bad-overview' },
})
export class BadOverviewComponent {
  private readonly badService = inject(BadResourceService);
  readonly listPreferences = inject(ListPreferencesService);
  readonly favoriteService = inject(FavoriteService);

  readonly badResource: ResourceRef<BadItem[] | undefined> =
    this.badService.badResource;
  readonly favorites = this.favoriteService.favoriteItems;

  readonly searchInput = signal('');

  // 1) Normalize source
  private readonly items = computed<BadItem[]>(
    () => this.badResource.value() ?? [],
  );

  // 2) Normalize search term
  private readonly searchTerm = computed(() =>
    this.searchInput().trim().toLowerCase(),
  );

  // 3) Textfilter for Bad, Ort, Becken..
  private readonly textFiltered = computed(() =>
    filterItems(this.items(), this.searchTerm(), ['bad', 'ort', 'becken']),
  );

  // 4) Custom filter (Fresh data, "nur aktuell")
  private readonly freshDataFiltered = computed(() => {
    const list = this.textFiltered();
    return this.listPreferences.filterField() === 'aktuell'
      ? list.filter((item) => isThisYear(item.date ?? null))
      : list;
  });

  // 5) Sortieren (renders the list)
  readonly filteredItems = computed(() =>
    sortItems(
      this.freshDataFiltered(),
      this.listPreferences.sortField() as keyof BadItem,
      this.listPreferences.sortDirection(),
    ),
  );
}
