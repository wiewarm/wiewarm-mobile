import { Injectable, signal, effect } from '@angular/core';
import type { FilterField } from '../../util/constants/filter-options';
import { FILTER_FIELDS } from '../../util/constants/filter-options';
import type { SortDirection, SortField } from '../../util/constants/sort-options';
import { SORT_FIELDS } from '../../util/constants/sort-options';
import { StorageService, STORAGE_KEYS } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ListPreferencesService {
  readonly sortField = signal<SortField>('kanton');
  readonly sortDirection = signal<SortDirection>('asc');
  readonly filterField = signal<FilterField>('aktuell');

  constructor(private readonly storage: StorageService) {
    this.loadFromStorage();
    effect(() => {
      this.storage.write(STORAGE_KEYS.list, {
        sortField: this.sortField(),
        sortDirection: this.sortDirection(),
        filterField: this.filterField(),
      });
    });
  }

  setSort(field: SortField, direction: SortDirection = 'asc') {
    this.sortField.set(field);
    this.sortDirection.set(direction);
  }

  setFilter(field: FilterField) {
    this.filterField.set(field);
  }

  private loadFromStorage() {
    const parsed = this.storage.read<{
      sortField?: SortField;
      sortDirection?: SortDirection;
      filterField?: FilterField;
    }>(STORAGE_KEYS.list);
    if (!parsed) return;
    if (parsed.sortField && parsed.sortField in SORT_FIELDS) {
      this.sortField.set(parsed.sortField);
    }
    if (parsed.sortDirection === 'asc' || parsed.sortDirection === 'desc') {
      this.sortDirection.set(parsed.sortDirection);
    }
    if (parsed.filterField && parsed.filterField in FILTER_FIELDS) {
      this.filterField.set(parsed.filterField);
    }
  }
}
