export interface CurrentWeather {
  temperature: number;
  isDay: boolean;
  weatherCode: number;
  updatedAt: Date;
}

export interface WeatherLocation {
  latitude: number;
  longitude: number;
}