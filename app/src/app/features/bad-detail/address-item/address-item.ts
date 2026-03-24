import { Component, computed, input } from '@angular/core';
import type { BadDetail } from '../../../shared/services/interfaces/bad-detail.interface';
import { IconComponent } from 'src/app/shared/layout/icon/icon';
import { ExternalLinkDirective } from '../../../shared/directives/external-link';

@Component({
  selector: 'app-address-item',
  templateUrl: './address-item.html',
  styleUrls: ['./address-item.scss'],
  imports: [IconComponent, ExternalLinkDirective],
})
export class AddressItemComponent {
  readonly detail = input.required<BadDetail>();

  readonly googleMapsUrl = computed(() => {
    const d = this.detail();
    const query = [d.badname, d.adresse1, d.adresse2, d.plz, d.ort]
      .filter(Boolean)
      .join(' ');
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  });

  readonly websiteUrl = computed(() => {
    const url = this.detail().www;
    return url?.startsWith('http://') || url?.startsWith('https://')
      ? url
      : null;
  });
}
