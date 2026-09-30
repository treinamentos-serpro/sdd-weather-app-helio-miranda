import { describe, expect, it } from 'vitest';
import { getWeatherCodeInfo } from '../../src/lib/weatherCodes';

describe('getWeatherCodeInfo', () => {
  it('mapeia um código WMO conhecido para descrição e ícone', () => {
    expect(getWeatherCodeInfo(0)).toEqual({
      description: 'Céu limpo',
      icon: '☀️',
    });
  });

  it('usa fallback para código desconhecido ou ausente', () => {
    const fallback = { description: 'Condição indisponível', icon: '🌡️' };

    expect(getWeatherCodeInfo(999)).toEqual(fallback);
    expect(getWeatherCodeInfo(null)).toEqual(fallback);
  });
});
