import { weatherIcon } from './weather-icon.util';

describe('weatherIcon', () => {
  it('maps clear weather by day and night', () => {
    expect(weatherIcon(0, true)).toBe('#light_mode');
    expect(weatherIcon(0, false)).toBe('#dark_mode');
    expect(weatherIcon(1, true)).toBe('#light_mode');
    expect(weatherIcon(1, false)).toBe('#dark_mode');
  });

  it('maps common WMO weather code groups', () => {
    expect(weatherIcon(2, true)).toBe('#weather_cloud');
    expect(weatherIcon(45, true)).toBe('#weather_foggy');
    expect(weatherIcon(61, true)).toBe('#weather_rainy');
    expect(weatherIcon(71, true)).toBe('#weather_snowy');
    expect(weatherIcon(95, true)).toBe('#weather_thunderstorm');
  });
});
