const MAX_TEMP_CELSIUS = 60;
const TEMP_TOLERANCE = 0.5;

interface TempFilter {
  temp: number;
  range: [number, number];
  cleanQuery: string;
}

export function parseTempFilter(query: string): TempFilter | null {
  const regex = /^\s*(?<value>\d+(?:\.\d+)?)\s*(?:grad|\u00b0c|\u00b0)?\s*$/i;
  const match = query.match(regex);

  if (!match?.groups) return null;

  const temp = parseFloat(match.groups["value"]);
  if (temp > MAX_TEMP_CELSIUS) return null;

  return {
    temp,
    range: [temp - TEMP_TOLERANCE, temp + TEMP_TOLERANCE],
    cleanQuery: query.replace(match[0], '').trim(),
  };
}
