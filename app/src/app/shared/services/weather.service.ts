import { HttpClient } from '@angular/common/http';
import { inject, Injectable, resource, type Signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { z } from 'zod';

export interface WeatherLocation {
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  isDay: boolean;
  weatherCode: number;
  updatedAt: Date;
}

const currentWeatherSchema = z.object({
  current: z.object({
    time: z.string(),
    temperature_2m: z.coerce.number(),
    is_day: z.coerce.number(),
    weather_code: z.coerce.number(),
  }),
});

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);

  getCurrentWeatherResource(location: Signal<WeatherLocation | undefined>) {
    return resource<CurrentWeather, WeatherLocation | undefined>({
      params: () => location(),
      loader: ({ params }) => this.loadCurrentWeather(params),
    });
  }

  private async loadCurrentWeather(
    location: WeatherLocation,
  ): Promise<CurrentWeather> {
    const raw = await lastValueFrom(
      this.http.get<unknown>('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: String(location.latitude),
          longitude: String(location.longitude),
          current: 'temperature_2m,is_day,weather_code',
          timezone: 'auto',
        },
      }),
    );

    const data = currentWeatherSchema.parse(raw).current;
    return {
      temperature: data.temperature_2m,
      isDay: data.is_day === 1,
      weatherCode: data.weather_code,
      updatedAt: new Date(data.time),
    };
  }
}
