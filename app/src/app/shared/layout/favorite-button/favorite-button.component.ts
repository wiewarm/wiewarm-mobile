import { Component, HostBinding, inject, input } from '@angular/core';
import type { BadItem } from '../../services/interfaces/bad-item.interface';
import { FavoriteService } from '../../services/storage/favorite.service';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-favorite-button',
  imports: [IconComponent],
  template: `
    <button
      type="button"
      class="favorite-button"
      [disabled]="!item()"
      [attr.aria-label]="
        isFavorite() ? 'Favorit entfernen' : 'Als Favorit speichern'
      "
      (click)="toggle($event)"
    >
      <app-icon
        class="favorite-icon"
        [symbolId]="isFavorite() ? '#star' : '#star_border'"
      />
    </button>
  `,
  styleUrl: './favorite-button.component.scss',
})
export class FavoriteButtonComponent {
  readonly item = input<BadItem | null>(null);
  readonly variant = input<'inline' | 'overlay'>('inline');

  private readonly favoriteService = inject(FavoriteService);

  @HostBinding('class.is-overlay')
  protected get isOverlay(): boolean {
    return this.variant() === 'overlay';
  }

  protected isFavorite(): boolean {
    const item = this.item();
    return item ? this.favoriteService.isFavorite(item) : false;
  }

  protected toggle(event: Event): void {
    event.stopPropagation();

    const item = this.item();
    if (!item) return;

    this.favoriteService.toggleFavorite(item);
  }
}
