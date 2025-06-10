import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BadDetailResourceService } from 'src/app/shared/services/bad-detail.service';
import { BadDetail, BadDetailPool } from 'src/app/shared/interfaces/bad-detail.interface';

@Component({
  selector: 'app-bad-detail',
  templateUrl: './bad-detail.html',
  styleUrl: './bad-detail.scss',
  imports: [CommonModule],
})
export class BadDetailComponent {
  private readonly id = this.route.snapshot.paramMap.get('id') ?? '';
  readonly detailResource = this.detailService.getDetailResource(this.id);

  constructor(
    private route: ActivatedRoute,
    private detailService: BadDetailResourceService,
  ) {}

  poolEntries(detail: BadDetail | null | undefined): BadDetailPool[] {
    return detail?.becken ? Object.values(detail.becken) : [];
  }
}
