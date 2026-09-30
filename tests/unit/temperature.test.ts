import { describe, expect, it } from 'vitest';
import { convertTemperature, formatTemperature, unitLabel } from '../../src/lib/temperature';

describe('convertTemperature', () => {
  it.each([
    [0, 'fahrenheit', 32],
    [100, 'fahrenheit', 212],
    [-40, 'fahrenheit', -40],
    [37, 'fahrenheit', 98.6],
    [0, 'celsius', 0],
  ] as const)('%i °C para %s retorna %f', (temperatureC, unit, expected) => {
    expect(convertTemperature(temperatureC, unit)).toBe(expected);
  });

  it('retorna null para temperatura ausente ou não finita', () => {
    expect(convertTemperature(null, 'celsius')).toBeNull();
    expect(convertTemperature(Number.NaN, 'fahrenheit')).toBeNull();
  });
});

describe('formatTemperature', () => {
  it('arredonda para uma casa decimal e inclui o símbolo da unidade', () => {
    expect(formatTemperature(12.34, 'celsius')).toBe('12.3°C');
    expect(formatTemperature(1.25, 'celsius')).toBe('1.3°C');
    expect(formatTemperature(-1.25, 'celsius')).toBe('-1.3°C');
    expect(formatTemperature(0, 'fahrenheit')).toBe('32.0°F');
    expect(formatTemperature(-40, 'fahrenheit')).toBe('-40.0°F');
  });

  it('indica temperatura indisponível sem inventar um valor', () => {
    expect(formatTemperature(null, 'celsius')).toBe('Indisponível');
  });
});

describe('unitLabel', () => {
  it('retorna o símbolo correspondente à unidade', () => {
    expect(unitLabel('celsius')).toBe('°C');
    expect(unitLabel('fahrenheit')).toBe('°F');
  });
});
