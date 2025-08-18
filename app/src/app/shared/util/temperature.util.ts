export function temperatureClass(temp: number | null): string {
  if (temp == null || Number.isNaN(temp)) return 'temp-unknown';
  switch (true) {
    case temp < 15:
      return 'temp-cold';
    case temp < 20:
      return 'temp-cool';
    case temp < 24:
      return 'temp-mild';
    case temp < 27:
      return 'temp-warm';
    default:
      return 'temp-hot';
  }
}
