import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BadItem } from 'src/app/shared/interfaces/bad-item.interface';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { isOlderThanOneMonth } from 'src/app/shared/util/date.util';
import { temperatureClass } from 'src/app/shared/util/temperature.util';

@Component({
  selector: 'app-accordion-item',
  standalone: true,
  templateUrl: './accordion-item.html',
  styleUrl: './accordion-item.scss',
  imports: [CommonModule, RouterModule, CdkAccordionModule],
})
export class AccordionItemComponent {
  isOlderThanOneMonth = isOlderThanOneMonth;
  temperatureClass = temperatureClass;

  readonly item = input.required<BadItem>();
  readonly index = input.required<number>();

  constructor(private favoriteService: FavoriteService) {}

  isFavorite(item: BadItem): boolean {
    const fav = this.favoriteService.favoriteSignal();
    return fav != null && fav.beckenid === item.beckenid;
  }

  toggleFavorite(item: BadItem) {
    if (this.isFavorite(item)) {
      this.favoriteService.clearFavorite();
    } else {
      this.favoriteService.setFavorite(item);
    }
  }
}
