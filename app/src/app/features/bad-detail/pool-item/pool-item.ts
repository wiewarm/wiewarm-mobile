import { Component, input } from '@angular/core';
import { BadDetailPool } from '../../../shared/services/interfaces/bad-detail.interface';
import { TemperatureDirective } from 'src/app/shared/directives/temperature';
import { IconComponent } from "src/app/shared/layout/icon/icon";

@Component({
  selector: 'app-pool-item',
  imports: [TemperatureDirective, IconComponent],
  styleUrls: ['./pool-item.scss'],
  templateUrl: './pool-item.html',
})
export class PoolItemComponent {
  readonly pool = input.required<BadDetailPool>();
}
