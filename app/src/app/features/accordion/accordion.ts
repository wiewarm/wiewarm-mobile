import { CdkAccordionModule } from '@angular/cdk/accordion';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BadItem } from 'src/app/shared/interfaces/bad-item.interface';
import { BadResourceService } from 'src/app/shared/services/bad-detail.service';
import { isOlderThanOneMonth } from 'src/app/shared/util/date.util';
import { temperatureClass } from 'src/app/shared/util/temperature.util';
import { SortDialogComponent } from 'src/app/shared/layout/sort-dialog/sort-dialog';
import { FavoriteService } from 'src/app/shared/services/favorite.service';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.html',
  styleUrl: './accordion.scss',
  imports: [
    CommonModule,
    FormsModule,
    CdkAccordionModule,
    ScrollingModule,
    RouterModule,
    SortDialogComponent,
  ],
})
export class AccordionComponent {
  isOlderThanOneMonth = isOlderThanOneMonth;
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
  readonly tableColumns = ['bad', 'ort', 'temp', 'date_pretty'];

  sortField = signal<keyof BadItem>('becken');
  sortDirection = signal<'asc' | 'desc'>('asc');

  setSort(field: keyof BadItem, direction: 'asc' | 'desc' = 'asc') {
    this.sortField.set(field);
    this.sortDirection.set(direction);
  }

  isFavorite(item: BadItem): boolean {
    const fav = this.favorite();
    return fav != null && fav.beckenid === item.beckenid;
  }

  toggleFavorite(item: BadItem) {
    if (this.isFavorite(item)) {
      this.favoriteService.clearFavorite();
    } else {
      this.favoriteService.setFavorite(item);
    }
  }

  filteredItems = computed(() => {
    const term = this.searchInput().toLowerCase();
    const items = this.badResource.value() ?? [];
    const filtered = term ? this.filterItems(items, term) : items;
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
