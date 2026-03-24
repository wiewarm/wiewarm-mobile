import { Component, input, signal } from '@angular/core';
import type { OwlOptions } from 'ngx-owl-carousel-o';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { environment } from '../../../../environments/environment';
import { IconComponent } from '../../../shared/layout/icon/icon';
import type { BadImage } from '../../../shared/services/interfaces/bad-image.interface';
import type { BadDetail } from 'src/app/shared/services/interfaces/bad-detail.interface';

@Component({
  selector: 'app-img-item',
  imports: [CarouselModule, IconComponent],
  templateUrl: './img-item.html',
  styleUrl: './img-item.scss',
})
export class ImgItemComponent {
  readonly detail = input.required<BadDetail>();
  protected readonly isOpen = signal(false);

  readonly carouselOptions: OwlOptions = {
    loop: true,
    items: 1,
    responsive: {
      768: {
        items: 2,
      },
    },
  };

  readonly toggle = () => this.isOpen.update((open) => !open);

  imageSrc(image: BadImage): string {
    const base = environment.imageBase.replace(/\/?$/, '/');
    const path = String(image.image || '').replace(/^\/+/, '');
    return `${base}${path}`;
  }
}
