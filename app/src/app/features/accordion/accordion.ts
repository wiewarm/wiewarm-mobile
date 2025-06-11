import { CdkAccordionModule } from '@angular/cdk/accordion';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, computed, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BadItem } from 'src/app/shared/interfaces/bad-item.interface';
import { DialogDirective } from 'src/app/shared/layout/dialog/dialog.directive';
import { isOlderThanOneMonth } from 'src/app/shared/util/date.util';

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
    DialogDirective,
  ],
})
export class AccordionComponent {
  isOlderThanOneMonth = isOlderThanOneMonth;

  private readonly BAD_ITEM_URL =
    'https://beta.wiewarm.ch:443/api/v1/temperature/all_current.json/0';

  searchInput = signal('');
  readonly tableColumns = ['bad', 'ort', 'temp', 'date_pretty'];

  sortDialogOpen = false;
  sortField = signal<keyof BadItem>('becken');
  sortDirection = signal<'asc' | 'desc'>('asc');

  setSort(field: keyof BadItem, direction: 'asc' | 'desc' = 'asc') {
    this.sortField.set(field);
    this.sortDirection.set(direction);
  }

  badResource = resource<BadItem[], unknown>({
    loader: ({ abortSignal }) =>
      fetch(this.BAD_ITEM_URL, { signal: abortSignal }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<BadItem[]>;
      }),
  });

  filteredItems = computed(() => {
    const term = this.searchInput().toLowerCase();
    const items = this.badResource.value() ?? [];
    const filtered = term ? this.filterItems(items, term) : items;
    return this.sortItems(filtered, this.sortField(), this.sortDirection());
  });

  temperatureClass(temp: number | null | undefined): string {
    if (temp == null) return 'temp-unknown';
    if (temp < 15) return 'temp-cold';
    if (temp < 20) return 'temp-cool';
    if (temp < 24) return 'temp-mild';
    if (temp < 27) return 'temp-warm';
    return 'temp-hot';
  }

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
