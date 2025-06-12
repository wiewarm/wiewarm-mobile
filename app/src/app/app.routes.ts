import { Routes } from '@angular/router';
import { AccordionComponent } from './features/accordion/accordion';
import { BadDetailComponent } from './features/bad-detail/bad-detail';

export const routes: Routes = [
  {
    path: '',
    title: 'wiewarm.ch - Aktuelle Temperaturen',
    component: AccordionComponent,
  },
  {
    path: ':id',
    title: 'wiewarm.ch - Detail',
    component: BadDetailComponent,
  },
];
