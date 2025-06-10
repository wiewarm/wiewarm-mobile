import { Routes } from '@angular/router';
import { ListComponent } from './features/list/list';
import { AccordionComponent } from './features/accordion/accordion';
import { BadDetailComponent } from './features/bad-detail/bad-detail';

export const routes: Routes = [
  { path: '', component: AccordionComponent },
  // { path: 'list', component: ListComponent },
  { path: 'badi/:id', component: BadDetailComponent },
];
