import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { signal } from '@angular/core';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  let httpMock: HttpTestingController;
  let service: WeatherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(WeatherService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads the current temperature for coordinates', fakeAsync(() => {
    const location = signal({ latitude: 47.3769, longitude: 8.5417 });
    const weatherResource = TestBed.runInInjectionContext(() =>
      service.getCurrentWeatherResource(location),
    );

    weatherResource.value();
    tick();

    const req = httpMock.expectOne(
      (request) => request.url === 'https://api.open-meteo.com/v1/forecast',
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('latitude')).toBe('47.3769');
    expect(req.request.params.get('longitude')).toBe('8.5417');
    expect(req.request.params.get('current')).toBe(
      'temperature_2m,is_day,weather_code',
    );
    expect(req.request.params.get('timezone')).toBe('auto');
    req.flush({
      current: {
        time: '2026-05-28T11:00',
        temperature_2m: 22.4,
        is_day: 1,
        weather_code: 2,
      },
    });

    tick();
    const result = weatherResource.value();
    expect(result).toBeDefined();
    if (!result) return;

    expect(result.temperature).toBe(22.4);
    expect(result.isDay).toBeTrue();
    expect(result.weatherCode).toBe(2);
    expect(result.updatedAt).toEqual(new Date('2026-05-28T11:00'));
  }));
});
