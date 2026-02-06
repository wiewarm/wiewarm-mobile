import { CdkAccordionModule } from '@angular/cdk/accordion';
import { NgOptimizedImage } from '@angular/common';
import type { ResourceRef } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterDialogComponent } from '../../shared/layout/filter-dialog/filter-dialog';
import { IconComponent } from '../../shared/layout/icon/icon';
import { LoadingErrorComponent } from '../../shared/layout/loading-error/loading-error.component';
import { SortDialogComponent } from '../../shared/layout/sort-dialog/sort-dialog';
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
import { NewsStoriesSectionComponent } from './news-stories-section/news-stories-section';

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
    NewsStoriesSectionComponent,
    LoadingErrorComponent,
    IconComponent,
    NgOptimizedImage,
  ],
  host: {
    role: 'main', // a11y
    class: 'bad-overview',
  },
})
export class BadOverviewComponent {
  private readonly deferredDialogOpenRetries = 20;
  private readonly destroyRef = inject(DestroyRef);
  private readonly badService = inject(BadResourceService);
  private readonly listPreferences = inject(ListPreferencesService);
  private deferredDialogTimer: ReturnType<typeof setTimeout> | null = null;
  private isDestroyed = false;
  readonly favoriteService = inject(FavoriteService);
  readonly sortDialogRef = viewChild(SortDialogComponent);
  readonly filterDialogRef = viewChild(FilterDialogComponent);

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.isDestroyed = true;
      this.clearDeferredDialogTimer();
    });
  }

  readonly badResource: ResourceRef<BadItem[] | undefined> =
    this.badService.badResource;
  readonly favorites = this.favoriteService.favoriteItems;
  readonly searchInput = signal('');

  readonly sortField = this.listPreferences.sortField;
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
      this.sortField() as keyof BadItem,
      this.sortDirection(),
    );
  });

  setFilter(option: FilterField) {
    this.listPreferences.setFilter(option);
  }

  setSort(field: SortField, direction: SortDirection = 'asc') {
    this.listPreferences.setSort(field, direction);
  }

  openSortDialog() {
    this.openDeferredDialog(() => this.sortDialogRef());
  }

  openFilterDialog() {
    this.openDeferredDialog(() => this.filterDialogRef());
  }

  private openDeferredDialog(
    getDialog: () => SortDialogComponent | FilterDialogComponent | undefined,
    retries = this.deferredDialogOpenRetries,
  ) {
    // Dialog instances can be undefined briefly because sort/filter are rendered via @defer.
    if (this.isDestroyed) return;

    const dialog = getDialog();
    if (dialog) {
      this.clearDeferredDialogTimer();
      dialog.open();
      return;
    }

    if (retries <= 0) return;
    this.clearDeferredDialogTimer();
    this.deferredDialogTimer = setTimeout(() => {
      this.deferredDialogTimer = null;
      this.openDeferredDialog(getDialog, retries - 1);
    }, 16);
  }

  private clearDeferredDialogTimer() {
    if (this.deferredDialogTimer === null) return;
    clearTimeout(this.deferredDialogTimer);
    this.deferredDialogTimer = null;
  }
}
