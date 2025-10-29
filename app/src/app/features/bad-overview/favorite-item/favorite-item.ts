import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TemperatureDirective } from 'src/app/shared/directives/temperature';
import type { BadItem } from 'src/app/shared/services/interfaces/bad-item.interface';
import { IconComponent } from 'src/app/shared/layout/icon/icon';

@Component({
  selector: 'app-favorite-item',
  imports: [RouterModule, TemperatureDirective, IconComponent],
  templateUrl: './favorite-item.html',
  styleUrl: './favorite-item.scss',
})
export class FavoriteItemComponent {
  readonly favorite = input.required<BadItem | null>();
}
