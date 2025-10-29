import type { Routes } from '@angular/router';
import { BadOverviewComponent } from './features/bad-overview/bad-overview';
import { BadDetailComponent } from './features/bad-detail/bad-detail';

export const routes: Routes = [
  {
    path: '',
    title: 'wiewarm.ch - Aktuelle Temperaturen',
    component: BadOverviewComponent,
  },
  {
    path: ':id',
    title: 'wiewarm.ch - Detail',
    component: BadDetailComponent,
  },
];
