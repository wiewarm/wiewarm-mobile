import { Component, input } from '@angular/core';
import type { BadDetail } from '../../../shared/services/interfaces/bad-detail.interface';
import { IconComponent } from "src/app/shared/layout/icon/icon";

@Component({
  selector: 'app-address-item',
  templateUrl: './address-item.html',
  styleUrls: ['./address-item.scss'],
  imports: [IconComponent],
})
export class AddressItemComponent {
  readonly detail = input.required<BadDetail>();
}
