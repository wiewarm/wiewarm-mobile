import { Component, input } from '@angular/core';
import type { OwlOptions } from 'ngx-owl-carousel-o';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { environment } from '../../../../environments/environment';
import type { BadImage } from '../../../shared/services/interfaces/bad-image.interface';
import type { BadDetail } from 'src/app/shared/services/interfaces/bad-detail.interface';

@Component({
  selector: 'app-img-item',
  imports: [CarouselModule],
  templateUrl: './img-item.html',
  styleUrl: './img-item.scss',
})
export class ImgItemComponent {
  readonly detail = input.required<BadDetail>();

  readonly carouselOptions: OwlOptions = {
    loop: true,
    dots: false,
    nav: false,
    items: 1,
    responsive: {
      768: {
        items: 2,
      },
    },
  };

  imageSrc(image: BadImage): string {
    const base = environment.imageBase.replace(/\/?$/, '/');
    const path = String(image.image || '').replace(/^\/+/, '');
    return `${base}${path}`;
  }
}
