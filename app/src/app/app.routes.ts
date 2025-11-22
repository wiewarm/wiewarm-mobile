import type { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    title: 'wiewarm.ch - Aktuelle Temperaturen',
    loadComponent: () =>
      import('./features/bad-overview/bad-overview').then(
        (m) => m.BadOverviewComponent
      ),
  },
  {
    path: ':id',
    title: 'wiewarm.ch - Detail',
    loadComponent: () =>
      import('./features/bad-detail/bad-detail').then(
        (m) => m.BadDetailComponent
      ),
  },
];
