import { Component, Input } from '@angular/core';
import { BadDetail } from '../../../shared/services/interfaces/bad-detail.interface';
import { IconComponent } from "src/app/shared/layout/icon/icon";

@Component({
  selector: 'app-address-item',
  templateUrl: './address-item.html',
  styleUrls: ['./address-item.scss'],
  imports: [IconComponent],
})
export class AddressItemComponent {
  @Input({ required: true }) detail!: BadDetail;
}
