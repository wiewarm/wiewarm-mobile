import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import type { CurrentWeather } from '../../../shared/services/weather.service';
import { IconComponent } from '../../../shared/layout/icon/icon';
import { DatePipe } from '@angular/common';
import { weatherIcon } from '../../../shared/util/weather-icon.util';

@Component({
  selector: 'app-weather-item',
  templateUrl: './weather-item.html',
  styleUrl: './weather-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, IconComponent],
})
export class WeatherItemComponent {
  readonly weather = input.required<CurrentWeather>();

  readonly roundedTemperature = computed(() =>
    Math.round(this.weather().temperature),
  );

  readonly icon = computed(() => {
    const weather = this.weather();
    return weatherIcon(weather.weatherCode, weather.isDay);
  });
}
