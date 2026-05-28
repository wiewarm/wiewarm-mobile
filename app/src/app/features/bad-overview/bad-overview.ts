import { CdkAccordionModule } from '@angular/cdk/accordion';
import type { ResourceRef } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

import { LoadingErrorComponent } from '../../shared/layout/loading-error/loading-error';
import { NewsSectionComponent } from './news-section/news-section';
import { ImpressionsSectionComponent } from './impressions-section/impressions-section';
import { BadResourceService } from '../../shared/services/bad.service';
import type { BadItem } from '../../shared/services/interfaces/bad-item.interface';
import { FavoriteService } from '../../shared/services/storage/favorite.service';
import { ListPreferencesService } from '../../shared/services/storage/list-preferences.service';
import {
  createBadSearchIndex,
  suggestBadSearchTerm,
  type BadSearchIndex,
} from '../../shared/util/bad-search.util';
import { isThisYear } from '../../shared/util/date.util';
import { sortItems } from '../../shared/util/list.util';
import { TEMPERATURE_SCALE } from '../../shared/util/temperature.util';

import { SearchService } from '../../shared/services/search/search.service';
import { BadSearchComponent } from './bad-search/bad-search';
import { BadItemComponent } from './bad-item/bad-item';
import { FilterSortControlsComponent } from './filter-sort-controls/filter-sort-controls';
import { FavoriteItemComponent } from './favorite-item/favorite-item';

@Component({
  selector: 'main[app-bad-overview]',
  templateUrl: './bad-overview.html',
  styleUrl: './bad-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdkAccordionModule,
    BadSearchComponent,
    BadItemComponent,
    FilterSortControlsComponent,
    FavoriteItemComponent,
    NewsSectionComponent,
    ImpressionsSectionComponent,
    LoadingErrorComponent,
  ],
  host: { role: 'main', class: 'bad-overview' },
  providers: [SearchService],
})
export class BadOverviewComponent {
  private readonly badService = inject(BadResourceService);
  private readonly overviewSearch = inject(SearchService);
  readonly listPreferences = inject(ListPreferencesService);
  readonly favoriteService = inject(FavoriteService);

  readonly badResource: ResourceRef<BadItem[] | undefined> =
    this.badService.badResource;
  readonly favorites = this.favoriteService.favoriteItems;
  readonly temperatureScale = TEMPERATURE_SCALE;
  readonly listHeading = computed(() =>
    this.listPreferences.filterField() === 'aktuell'
      ? 'Aktuelle Temperaturen'
      : 'Alle Temperaturen',
  );

  readonly searchInput = signal('');
  private readonly searchIndex = signal<BadSearchIndex | null>(null);
  private searchIndexBuildId = 0;

  constructor() {
    effect(() => {
      const items = this.badService.getBadItems();
      const buildId = ++this.searchIndexBuildId;
      void createBadSearchIndex(items).then((index) => {
        if (buildId === this.searchIndexBuildId) {
          this.searchIndex.set(index);
        }
      });
    });
  }

  private readonly searchItems = computed(() => {
    const index = this.searchIndex();
    return index
      ? this.overviewSearch.search(index, this.searchInput())
      : this.badService.getBadItems();
  });

  readonly searchSuggestion = computed(() => {
    const index = this.searchIndex();
    return index && this.searchItems().length === 0
      ? suggestBadSearchTerm(index, this.searchInput())
      : null;
  });

  readonly filteredItems = computed(() => {
    let list = this.searchItems();

    // Custom filter (Fresh data, "nur aktuell")
    if (this.listPreferences.filterField() === 'aktuell') {
      list = list.filter((item) => isThisYear(item.date ?? null));
    }

    // Sort (renders the list)
    return sortItems(
      list,
      this.listPreferences.sortField() as keyof BadItem,
      this.listPreferences.sortDirection(),
    );
  });
}
