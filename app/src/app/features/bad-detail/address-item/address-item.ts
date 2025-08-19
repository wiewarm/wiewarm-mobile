import { Component, Input } from '@angular/core';
import { BadDetail } from '../../../shared/services/interfaces/bad-detail.interface';

@Component({
  selector: 'app-address-item',
  templateUrl: './address-item.html',
  styleUrls: ['./address-item.scss'],
})
export class AddressItemComponent {
  @Input({ required: true }) detail!: BadDetail;
}
