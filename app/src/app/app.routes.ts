import { Routes } from '@angular/router';
import { ListComponent } from './features/list/list';
import { AccordionComponent } from './features/accordion/accordion';

export const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'accordion', component: AccordionComponent },
  // { path: 'badi/:id', component: BadDetail },
];
