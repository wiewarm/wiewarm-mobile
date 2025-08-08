import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BadItem } from 'src/app/shared/services/interfaces/bad-item.interface';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { isOlderThanOneMonth } from 'src/app/shared/util/date.util';
import { temperatureClass } from 'src/app/shared/util/temperature.util';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-bad-item',
  templateUrl: './bad-item.html',
  styleUrl: './bad-item.scss',
  imports: [CommonModule, RouterModule, CdkAccordionModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '200ms ease-in-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: 0, opacity: 0, overflow: 'hidden' }),
        animate('200ms ease-in-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ overflow: 'hidden' }),
        animate('200ms ease-in-out', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
  host: { '[@fadeIn]': '' },
})
export class BadItemComponent {
  isOlderThanOneMonth = isOlderThanOneMonth;
  temperatureClass = temperatureClass;

  readonly item = input.required<BadItem>();
  readonly index = input.required<number>();

  constructor(public favoriteService: FavoriteService) {}
}
