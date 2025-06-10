import { CommonModule } from '@angular/common';
import { Component, computed, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';
import { BadItem } from 'src/app/shared/interfaces/bad-item.interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.html',
  imports: [CommonModule, FormsModule, ScrollingModule, CdkTableModule],
  styleUrl: './list.scss',
})
export class ListComponent {
  private readonly BAD_ITEM_URL =
    'https://beta.wiewarm.ch:443/api/v1/temperature/all_current.json/0';

  searchInput = signal('');
  readonly tableColumns = ['bad', 'ort', 'temp', 'date_pretty'];

  itemsResource = resource<BadItem[], unknown>({
    loader: ({ abortSignal }) =>
      fetch(this.BAD_ITEM_URL, { signal: abortSignal }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<BadItem[]>;
      }),
  });
  filteredItems = computed(() => {
    const term = this.searchInput().toLowerCase();
    const items = this.itemsResource.value() ?? [];

    return items.filter((item) => {
      const hay = this.tableColumns
        .map((key) => item[key]?.toString().toLowerCase() ?? '')
        .join(' ');

      return !term || hay.includes(term);
    });
  });

  temperatureClass(temp: number | null | undefined): string {
    if (temp == null) return 'temp-unknown';
    if (temp < 15) return 'temp-cold';
    if (temp < 20) return 'temp-cool';
    if (temp < 24) return 'temp-mild';
    if (temp < 27) return 'temp-warm';
    return 'temp-hot';
  }
}
