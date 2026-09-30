import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWeather } from '../../src/hooks/useWeather';
import { getWeather, searchCities } from '../../src/services/weatherService';
import type { City, WeatherData } from '../../src/types/weather';

vi.mock('../../src/services/weatherService', () => ({
  getWeather: vi.fn(),
  searchCities: vi.fn(),
}));

const city: City = {
  id: 3448439,
  name: 'São Paulo',
  admin1: 'São Paulo',
  country: 'Brasil',
  latitude: -23.55,
  longitude: -46.63,
};

const weather: WeatherData = {
  city,
  timezone: 'America/Sao_Paulo',
  current: {
    temperatureC: 23.4,
    weatherCode: 3,
    observedAt: '2026-09-30T14:00',
    humidityPercent: 62,
    windSpeedKmh: 14.2,
    precipitationMm: 0,
    pressureHpa: 1013.2,
  },
  forecast: [],
  forecastComplete: false,
};

describe('useWeather', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('começa em idle sem dados nem erro', () => {
    const { result } = renderHook(() => useWeather());

    expect(result.current.status).toBe('idle');
    expect(result.current.data).toBeNull();
    expect(result.current.cities).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.query).toBe('');
  });

  it('não consulta services para uma busca vazia', async () => {
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('   ');
    });

    expect(result.current.status).toBe('idle');
    expect(searchCities).not.toHaveBeenCalled();
    expect(getWeather).not.toHaveBeenCalled();
  });

  it('retorna empty quando a busca não encontra cidades', async () => {
    vi.mocked(searchCities).mockResolvedValueOnce([]);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('Cidade inexistente');
    });

    expect(result.current.status).toBe('empty');
    expect(result.current.query).toBe('Cidade inexistente');
    expect(result.current.cities).toEqual([]);
    expect(getWeather).not.toHaveBeenCalled();
  });

  it('repete a busca após falha de rede e só então exibe os resultados', async () => {
    vi.mocked(searchCities)
      .mockRejectedValueOnce(new TypeError('offline'))
      .mockResolvedValueOnce([city]);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('São Paulo');
    });

    expect(result.current.status).toBe('error');
    expect(getWeather).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.retry();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.cities).toEqual([city]);
    expect(searchCities).toHaveBeenCalledTimes(2);
    expect(getWeather).not.toHaveBeenCalled();
  });

  it('aguarda a seleção explícita antes de consultar o clima', async () => {
    vi.mocked(searchCities).mockResolvedValueOnce([city, { ...city, id: 2, name: 'Outra cidade' }]);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('São Paulo');
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.cities).toHaveLength(2);
    expect(result.current.data).toBeNull();
    expect(getWeather).not.toHaveBeenCalled();
  });

  it('carrega a cidade explicitamente selecionada entre resultados homônimos', async () => {
    const selectedCity = { ...city, id: 2, name: 'São Paulo', admin1: 'Minas Gerais' };
    vi.mocked(searchCities).mockResolvedValueOnce([city, selectedCity]);
    vi.mocked(getWeather).mockResolvedValueOnce({ ...weather, city: selectedCity });
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('São Paulo');
    });
    expect(getWeather).not.toHaveBeenCalled();
    await act(async () => {
      await result.current.selectCity(selectedCity);
    });

    expect(result.current.cities).toEqual([city, selectedCity]);
    expect(result.current.data?.city).toEqual(selectedCity);
    expect(getWeather).toHaveBeenLastCalledWith(selectedCity, expect.any(AbortSignal));
  });

  it('ignora resposta de uma busca antiga que termina depois da busca atual', async () => {
    const currentCity = { ...city, id: 2, name: 'Rio de Janeiro' };
    let resolveOldSearch!: (cities: City[]) => void;
    const oldSearch = new Promise<City[]>((resolve) => {
      resolveOldSearch = resolve;
    });
    vi.mocked(searchCities).mockReturnValueOnce(oldSearch).mockResolvedValueOnce([currentCity]);
    vi.mocked(getWeather).mockResolvedValueOnce({ ...weather, city: currentCity });
    const { result } = renderHook(() => useWeather());
    let oldRequest: Promise<void> = Promise.resolve();

    act(() => {
      oldRequest = result.current.search('Busca antiga');
    });

    await act(async () => {
      await result.current.search('Rio de Janeiro');
    });
    await act(async () => {
      await result.current.selectCity(currentCity);
    });

    await act(async () => {
      resolveOldSearch([city]);
      await oldRequest;
    });

    expect(result.current.status).toBe('success');
    expect(result.current.data?.city).toEqual(currentCity);
    expect(result.current.cities).toEqual([currentCity]);
    expect(getWeather).toHaveBeenCalledTimes(1);
    expect(getWeather).toHaveBeenCalledWith(currentCity, expect.any(AbortSignal));
  });

  it('seleciona uma cidade diretamente e retry repete a última consulta', async () => {
    vi.mocked(getWeather)
      .mockRejectedValueOnce(new Error('Falha de rede.'))
      .mockResolvedValueOnce(weather);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.selectCity(city);
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error?.message).toBe('Falha de rede.');

    await act(async () => {
      await result.current.retry();
    });

    expect(result.current.status).toBe('success');
    expect(result.current.data).toEqual(weather);
    expect(getWeather).toHaveBeenCalledTimes(2);
  });
});
