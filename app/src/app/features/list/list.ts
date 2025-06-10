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
  readonly displayedColumns = ['bad', 'ort'];

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

    return items.filter((item: any) => {
      const hay =
        `${item.bad} ${item.becken} ${item.ort} ${item.plz}`.toLowerCase();
      return !term || hay.includes(term);
    });
  });
}
