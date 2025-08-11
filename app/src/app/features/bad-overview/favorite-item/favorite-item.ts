import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BadItem } from 'src/app/shared/services/interfaces/bad-item.interface';
import { temperatureClass } from 'src/app/shared/util/temperature.util';

@Component({
  selector: 'app-favorite-item',
  imports: [RouterModule],
  templateUrl: './favorite-item.html',
  styleUrl: './favorite-item.scss',
})
export class FavoriteItemComponent {
  temperatureClass = temperatureClass;
  readonly favorite = input.required<BadItem | null>();
}
