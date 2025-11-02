import { Component, inject} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LoadingErrorComponent } from '../../shared/layout/loading-error/loading-error.component';
import type {
  BadDetail,
  BadDetailPool,
} from 'src/app/shared/services/interfaces/bad-detail.interface';
import { BadResourceService } from 'src/app/shared/services/bad.service';
import { AddressItemComponent } from './address-item/address-item';
import { PoolItemComponent } from './pool-item/pool-item';
import { IconComponent } from 'src/app/shared/layout/icon/icon';
import { ImgItemComponent } from './img-item/img-item';

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
  readonly detailResource = this.detailService.getDetailResource(this.badId);

  poolEntries(detail: BadDetail | null | undefined): BadDetailPool[] {
    return detail?.becken ? Object.values(detail.becken) : [];
  }
}
