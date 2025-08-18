import { temperatureClass } from './temperature.util';

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
