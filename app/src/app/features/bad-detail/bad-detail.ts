import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LoadingErrorComponent } from '../../shared/layout/loading-error/loading-error.component';
import {
  BadDetail,
  BadDetailPool,
} from 'src/app/shared/services/interfaces/bad-detail.interface';
import { BadResourceService } from 'src/app/shared/services/bad.service';
import { temperatureClass } from 'src/app/shared/util/temperature.util';
import { AddressItemComponent } from './address-item/address-item';
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
  ],
})
export class BadDetailComponent {
  temperatureClass = temperatureClass;
  private readonly id =
    inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';

  readonly detailResource = this.detailService.getDetailResource(this.id);
  constructor(private detailService: BadResourceService) {}

  poolEntries(detail: BadDetail | null | undefined): BadDetailPool[] {
    return detail?.becken ? Object.values(detail.becken) : [];
  }
}
