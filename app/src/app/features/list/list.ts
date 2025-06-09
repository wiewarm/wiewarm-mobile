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
  standalone: true,
  styleUrl: './list.scss',
})
export class ListComponent {
  searchInput = signal('');
  sortBy = signal<'dist' | 'date'>('dist');
  userPosition = signal<{ lat: number; lon: number } | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  sortType = true;

  toggleSort() {
    this.sortType = !this.sortType;
    const next = this.sortBy() === 'dist' ? 'date' : 'dist';
    this.sortBy.set(next);
  }

  sortLabel() {
    return this.sortBy() === 'dist' ? 'Entfernung' : 'Datum';
  }

  itemsResource = resource<BadItem[], unknown>({
    loader: ({ abortSignal }) =>
      fetch(
        'https://beta.wiewarm.ch:443/api/v1/temperature/all_current.json/0',
        { signal: abortSignal }
      ).then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json() as Promise<BadItem[]>;
      }),
  });

  itemsWithDist = computed(() => {
    const items = this.itemsResource.value() ?? [];
    const pos = this.userPosition();
    if (!pos) {
      return items;
    }
    return items.map((item) => ({
      ...item,
      dist: this.distance(pos.lat, pos.lon, item.ortlat!, item.ortlong!),
    }));
  });

  filteredItems = computed(() => {
    const term = this.searchInput().toLowerCase();
    return this.itemsWithDist()
      .filter((item) => {
        const hay =
          `${item.bad} ${item.becken} ${item.ort} ${item.plz}`.toLowerCase();
        return !term || hay.includes(term);
      })
      .sort((a, b) => {
        if (this.sortBy() === 'date') {
          return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
        }
        const da = a.dist ?? Infinity;
        const db = b.dist ?? Infinity;
        if (da === db) {
          return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
        }
        return da - db;
      });
  });

  requestPosition() {
    if (!navigator.geolocation) return;
    this.loading.set(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.userPosition.set({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        this.loading.set(false);
      },
      (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
      { timeout: 10000 }
    );
  }
  // Hilfsfunktion zum Berechnen der Distanz ---
  private distance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6_371_000;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
