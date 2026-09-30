import type { Unit } from '../types/weather';

export function convertTemperature(temperatureC: number | null, unit: Unit): number | null {
  if (temperatureC === null || !Number.isFinite(temperatureC)) return null;

  const converted = unit === 'fahrenheit' ? (temperatureC * 9) / 5 + 32 : temperatureC;
  const rounded = (Math.round(Math.abs(converted) * 10) / 10) * Math.sign(converted);

  return Object.is(rounded, -0) ? 0 : rounded;
}

export function unitLabel(unit: Unit): string {
  return unit === 'celsius' ? '°C' : '°F';
}

export function formatTemperature(temperatureC: number | null, unit: Unit): string {
  const temperature = convertTemperature(temperatureC, unit);
  return temperature === null ? 'Indisponível' : `${temperature.toFixed(1)}${unitLabel(unit)}`;
}
