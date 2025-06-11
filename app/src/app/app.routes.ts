import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/accordion/accordion').then(
        (m) => m.AccordionComponent
      ),
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./features/bad-detail/bad-detail').then(
        (m) => m.BadDetailComponent
      ),
  },
];
