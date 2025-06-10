import { CommonModule } from '@angular/common';
import { Component, computed, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkMenuModule } from '@angular/cdk/menu';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { BadItem } from 'src/app/shared/interfaces/bad-item.interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.html',
  imports: [CommonModule, FormsModule, CdkMenuModule, ScrollingModule],
  styleUrl: './list.scss',
})
export class ListComponent {
  private readonly BAD_ITEM_URL = '/api/v1/temperature/all_current.json/0';

  searchInput = signal('');
  sortType = true;

  toggleSortDirection() {
    this.sortType = !this.sortType;
  }

  sortDirLabel() {
    return this.sortType ? 'aufsteigend' : 'absteigend';
  }

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

    const filtered = items.filter((item: any) => {
      const hay =
        `${item.bad} ${item.becken} ${item.ort} ${item.plz}`.toLowerCase();
      return !term || hay.includes(term);
    });

    // Sortieren nach Datum
    const sorted = [...filtered].sort((a, b) => {
      const ta = new Date(a.date).getTime();
      const tb = new Date(b.date).getTime();
      const cmp = ta - tb;
      return this.sortType ? cmp : -cmp;
    });

    return sorted;
  });
}
