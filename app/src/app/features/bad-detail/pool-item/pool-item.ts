import { Component, Input } from '@angular/core';
import { BadDetailPool } from '../../../shared/services/interfaces/bad-detail.interface';
import { temperatureClass } from '../../../shared/util/temperature.util';

@Component({
  selector: 'app-pool-item',
  styleUrls: ['./pool-item.scss'],
  templateUrl: './pool-item.html',
})
export class PoolItemComponent {
  @Input({ required: true }) pool!: BadDetailPool;
  temperatureClass = temperatureClass;
}
