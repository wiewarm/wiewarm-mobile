import { Component, input } from '@angular/core';
import type { BadDetail } from '../../../shared/services/interfaces/bad-detail.interface';
import { IconComponent } from 'src/app/shared/layout/icon/icon';

@Component({
  selector: 'app-address-item',
  templateUrl: './address-item.html',
  styleUrls: ['./address-item.scss'],
  imports: [IconComponent],
})
export class AddressItemComponent {
  readonly detail = input.required<BadDetail>();

  mapUrl(detail: BadDetail): string {
    const query = [
      detail.badname,
      detail.adresse1,
      detail.adresse2,
      detail.plz,
      detail.ort,
    ]
      .filter(Boolean)
      .join(' ');
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query,
    )}`;
  }
}
