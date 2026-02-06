import type { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    title: 'Übersicht',
    loadComponent: () =>
      import('./features/bad-overview/bad-overview').then(
        (m) => m.BadOverviewComponent
      ),
  },
  {
    path: ':id',
    title: 'Detail',
    loadComponent: () =>
      import('./features/bad-detail/bad-detail').then(
        (m) => m.BadDetailComponent
      ),
  },
];
