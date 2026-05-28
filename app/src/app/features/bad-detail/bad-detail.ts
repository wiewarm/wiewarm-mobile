import type { ResourceRef } from '@angular/core';
import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { IconComponent } from '../../shared/layout/icon/icon';
import { FavoriteButtonComponent } from '../../shared/layout/favorite-button/favorite-button.component';
import { LoadingErrorComponent } from '../../shared/layout/loading-error/loading-error';
import { NewsSectionComponent } from '../bad-overview/news-section/news-section';
import { BadResourceService } from '../../shared/services/bad.service';
import type {
  BadDetail,
  BadDetailPool,
} from '../../shared/services/interfaces/bad-detail.interface';
import type { BadItem } from '../../shared/services/interfaces/bad-item.interface';
import { AddressItemComponent } from './address-item/address-item';
import { AddressItemEditComponent } from './address-item/address-item-edit/address-item-edit.component';
import { ImgItemComponent } from './img-item/img-item';
import { PoolItemComponent } from './pool-item/pool-item';
import { WeatherItemComponent } from './weather-item/weather-item';
import { AuthService } from '../../shared/services/auth/auth.service';
import { WeatherService } from '../../shared/services/weather.service';

@Component({
  selector: 'main[app-bad-detail]',
  templateUrl: './bad-detail.html',
  styleUrl: './bad-detail.scss',
  host: {
    role: 'main', // a11y
    class: 'bad-detail',
  },
  imports: [
    RouterModule,
    LoadingErrorComponent,
    AddressItemComponent,
    AddressItemEditComponent,
    PoolItemComponent,
    WeatherItemComponent,
    IconComponent,
    FavoriteButtonComponent,
    ImgItemComponent,
    NewsSectionComponent,
  ],
})
export class BadDetailComponent {
  readonly badId = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';
  private readonly title = inject(Title);

  private readonly detailService = inject(BadResourceService);
  private readonly authService = inject(AuthService);
  private readonly weatherService = inject(WeatherService);

  readonly detailResource: ResourceRef<BadDetail | undefined> =
    this.detailService.getDetailResource(this.badId);
  readonly detail = computed(() =>
    this.detailResource.hasValue() ? this.detailResource.value() : undefined,
  );

  readonly badItem = computed<BadItem | null>(
    () =>
      this.detailService
        .getBadItems()
        .find((i) => i.badid_text === this.badId) ?? null,
  );

  readonly canEdit = computed(() =>
    this.authService.canEdit(this.detail()?.badid),
  );

  readonly weatherLocation = computed(() => {
    const detail = this.detail();
    const latitude = detail?.ortlat;
    const longitude = detail?.ortlong;

    return latitude !== undefined && longitude !== undefined
      ? { latitude, longitude }
      : undefined;
  });

  readonly currentWeather = this.weatherService.getCurrentWeatherResource(
    this.weatherLocation,
  );

  readonly dynamicPageTitle = effect(() => {
    const name = this.detail()?.badname?.trim();
    if (name) {
      this.title.setTitle(`wiewarm.ch - ${name}`);
    }
  });

  refetchDetail() {
    this.detailResource.reload();
  }

  poolEntries(detail: BadDetail | null | undefined): BadDetailPool[] {
    return detail?.becken ? Object.values(detail.becken) : [];
  }
}
