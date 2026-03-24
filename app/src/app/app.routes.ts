import { inject } from '@angular/core';
import type { ResolveFn, Routes } from '@angular/router';
import { BadResourceService } from './shared/services/bad.service';

const DETAIL_PAGE_TITLE_FALLBACK = 'wiewarm.ch - Detail';

const badDetailTitle: ResolveFn<string> = async (route) => {
  const id = route.paramMap.get('id');
  const service = inject(BadResourceService);

  try {
    const detail = id ? await service.getDetail(id) : null;
    const name = detail?.badname?.trim();

    return name ? `wiewarm.ch - ${name}` : DETAIL_PAGE_TITLE_FALLBACK;
  } catch {
    return DETAIL_PAGE_TITLE_FALLBACK;
  }
};

export const routes: Routes = [
  {
    path: '',
    title: 'wiewarm.ch - Aktuelle Temperaturen',
    loadComponent: () =>
      import('./features/bad-overview/bad-overview').then(
        (m) => m.BadOverviewComponent,
      ),
  },
  {
    path: ':id',
    title: badDetailTitle,
    loadComponent: () =>
      import('./features/bad-detail/bad-detail').then(
        (m) => m.BadDetailComponent,
      ),
  },
];
