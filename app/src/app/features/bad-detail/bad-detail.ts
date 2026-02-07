import type { ResourceRef } from '@angular/core';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IconComponent } from '../../shared/layout/icon/icon';
import { LoadingErrorComponent } from '../../shared/layout/loading-error/loading-error';
import { BadResourceService } from '../../shared/services/bad.service';
import type {
  BadDetail,
  BadDetailPool,
} from '../../shared/services/interfaces/bad-detail.interface';
import type { BadItem } from '../../shared/services/interfaces/bad-item.interface';
import { FavoriteService } from '../../shared/services/storage/favorite.service';
import { AddressItemComponent } from './address-item/address-item';
import { ImgItemComponent } from './img-item/img-item';
import { PoolItemComponent } from './pool-item/pool-item';

@Component({
  selector: 'main[app-bad-detail]',
  templateUrl: './bad-detail.html',
  styleUrl: './bad-detail.scss',
  host: {
    role: 'main', // a11y
    class: 'bad-detail',
  },
  imports: [
    RouterModule,
    LoadingErrorComponent,
    AddressItemComponent,
    PoolItemComponent,
    IconComponent,
    ImgItemComponent,
  ],
})
export class BadDetailComponent {
  readonly badId =
    inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';

  private readonly detailService = inject(BadResourceService);
  readonly favoriteService = inject(FavoriteService);
  readonly detailResource: ResourceRef<BadDetail | undefined> = this.detailService.getDetailResource(this.badId);

  readonly listResource = this.detailService.badResource;
  readonly badItem = computed<BadItem | null>(() =>
    (this.listResource.value() ?? []).find((i) => i.badid_text === this.badId) ?? null
  );

  poolEntries(detail: BadDetail | null | undefined): BadDetailPool[] {
    return detail?.becken ? Object.values(detail.becken) : [];
  }
}
