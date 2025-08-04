import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  BadDetail,
  BadDetailPool,
} from 'src/app/shared/services/interfaces/bad-detail.interface';
import { BadResourceService } from 'src/app/shared/services/bad.service';
import { temperatureClass } from 'src/app/shared/util/temperature.util';

@Component({
  selector: 'app-bad-detail',
  templateUrl: './bad-detail.html',
  styleUrl: './bad-detail.scss',
  imports: [CommonModule, RouterModule],
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
