import { CdkAccordionModule } from '@angular/cdk/accordion';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, computed, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BadItem } from 'src/app/shared/interfaces/bad-item.interface';
import { DialogDirective } from 'src/app/shared/layout/dialog/dialog.directive';
import { filterItems, sortItems } from 'src/app/shared/util/filtersort.util';

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
  private readonly BAD_ITEM_URL =
    'https://beta.wiewarm.ch:443/api/v1/temperature/all_current.json/0';

  searchInput = signal('');
  readonly tableColumns = ['bad', 'ort', 'temp', 'date_pretty'];

  sortDialogOpen = false;
  sortField: keyof BadItem = 'becken';
  sortDirection = signal<'asc' | 'desc'>('asc');

  setSort(field: keyof BadItem, direction: 'asc' | 'desc' = 'asc') {
    this.sortField = field;
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
    const filtered = filterItems(
      items,
      term,
      this.tableColumns as (keyof BadItem)[]
    );
    return sortItems(filtered, this.sortField, this.sortDirection());
  });

  temperatureClass(temp: number | null | undefined): string {
    if (temp == null) return 'temp-unknown';
    if (temp < 15) return 'temp-cold';
    if (temp < 20) return 'temp-cool';
    if (temp < 24) return 'temp-mild';
    if (temp < 27) return 'temp-warm';
    return 'temp-hot';
  }

  isOlderThanOneMonth(dateStr: string | null | undefined): boolean {
    if (!dateStr) return false;
    const itemDate = new Date(dateStr.replace(' ', 'T'));
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);
    return itemDate < oneMonthAgo;
  }
}
