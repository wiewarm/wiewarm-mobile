export function weatherIcon(weatherCode: number, isDay: boolean): string {
  if (weatherCode === 45 || weatherCode === 48) {
    return '#weather_foggy';
  }

  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return '#weather_rainy';
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return '#weather_snowy';
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return '#weather_thunderstorm';
  }

  if (weatherCode === 2 || weatherCode === 3) {
    return '#weather_cloud';
  }

  return isDay ? '#light_mode' : '#dark_mode';
}
