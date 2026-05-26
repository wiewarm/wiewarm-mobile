const MAX_TEMP_CELSIUS = 60;
const TEMP_TOLERANCE = 0.5;

interface TempFilter {
  temp: number;
  range: [number, number];
  cleanQuery: string;
}

export function parseTempFilter(query: string): TempFilter | null {
  const match = query.match(
    /^\s*(\d{1,2}(?:\.\d+)?)\s*$|(\d+(?:\.\d+)?)\s*(?:grad|\u00b0c|\u00b0)/i,
  );

  if (!match) return null;

  const value = match[1] ?? match[2];
  const temp = parseFloat(value);
  if (temp > MAX_TEMP_CELSIUS) return null;

  return {
    temp,
    range: [temp - TEMP_TOLERANCE, temp + TEMP_TOLERANCE],
    cleanQuery: query.replace(match[0], '').trim(),
  };
}
