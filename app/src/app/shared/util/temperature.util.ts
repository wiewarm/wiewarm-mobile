export type TemperatureScaleItem = {
  readonly className: string;
  readonly label: string;
  readonly rangeText: string;
  readonly maxExclusive?: number;
};

export const TEMPERATURE_SCALE: TemperatureScaleItem[] = [
  {
    className: 'temp-cold',
    label: 'Kalt',
    rangeText: 'unter 15 °C',
    maxExclusive: 15,
  },
  {
    className: 'temp-cool',
    label: 'Kühl',
    rangeText: '15 bis 19.9 °C',
    maxExclusive: 20,
  },
  {
    className: 'temp-mild',
    label: 'Mild',
    rangeText: '20 bis 23.9 °C',
    maxExclusive: 24,
  },
  {
    className: 'temp-warm',
    label: 'Warm',
    rangeText: '24 bis 26.9 °C',
    maxExclusive: 27,
  },
  {
    className: 'temp-hot',
    label: 'Heiss',
    rangeText: 'ab 27 °C',
  },
];

function temperatureScaleItem(temp: number) {
  return TEMPERATURE_SCALE.find(
    ({ maxExclusive }) => maxExclusive === undefined || temp < maxExclusive,
  );
}

export function temperatureClass(temp: number | null): string {
  if (temp == null || Number.isNaN(temp)) return 'temp-unknown';
  return temperatureScaleItem(temp)?.className ?? 'temp-hot';
}

export function temperatureTitle(temp: number | null): string {
  if (temp == null || Number.isNaN(temp)) return 'Keine Temperatur';
  return temperatureScaleItem(temp)?.label ?? 'Heiss';
}
