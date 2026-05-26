import { temperatureClass, temperatureTitle } from './temperature.util';

describe('temperatureClass', () => {
  it('returns "temp-unknown" when value is null', () => {
    expect(temperatureClass(null)).toBe('temp-unknown');
  });
  it('returns "temp-cool" for temperatures below 20', () => {
    expect(temperatureClass(18)).toBe('temp-cool');
  });
  it('returns "temp-unknown" when value is NaN', () => {
    expect(temperatureClass(Number.NaN)).toBe('temp-unknown');
  });
});

describe('temperatureTitle', () => {
  it('returns "Keine Temperatur" when value is null', () => {
    expect(temperatureTitle(null)).toBe('Keine Temperatur');
  });

  it('returns "Keine Temperatur" when value is NaN', () => {
    expect(temperatureTitle(Number.NaN)).toBe('Keine Temperatur');
  });

  it('returns "Kalt" for temperatures below 15', () => {
    expect(temperatureTitle(14)).toBe('Kalt');
  });

  it('returns "Kühl" for temperatures below 20', () => {
    expect(temperatureTitle(18)).toBe('Kühl');
  });

  it('returns "Mild" for temperatures below 24', () => {
    expect(temperatureTitle(22)).toBe('Mild');
  });

  it('returns "Warm" for temperatures below 27', () => {
    expect(temperatureTitle(25)).toBe('Warm');
  });

  it('returns "Heiss" for temperatures from 27', () => {
    expect(temperatureTitle(27)).toBe('Heiss');
  });
});
