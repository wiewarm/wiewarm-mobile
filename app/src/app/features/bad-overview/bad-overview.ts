import { CdkAccordionModule } from '@angular/cdk/accordion';
import type { ElementRef, ResourceRef } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
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
  readonly searchOpen = signal(false);
  private readonly searchField =
    viewChild<ElementRef<HTMLInputElement>>('searchField');

  readonly filteredItems = computed(() => {
    // Normalize source
    const items = this.badResource.value() ?? [];

    // Normalize search term
    const term = this.searchInput().trim().toLowerCase();

    // Textfilter for Bad, Ort, Becken..
    let list = filterItems(items, term, ['bad', 'ort', 'becken']);

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

  toggleSearch() {
    if (this.searchOpen() && !this.searchInput().trim()) {
      this.searchOpen.set(false);
      return;
    }

    this.searchOpen.set(true);
    requestAnimationFrame(() => this.searchField()?.nativeElement.focus());
  }

  onSearchBlur() {
    if (!this.searchInput().trim()) {
      this.searchOpen.set(false);
    }
  }
}
