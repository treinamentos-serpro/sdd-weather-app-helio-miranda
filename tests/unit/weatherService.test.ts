import { afterEach, describe, expect, it, vi } from 'vitest';
import { getWeather, searchCities, WeatherServiceError } from '../../src/services/weatherService';
import type { City } from '../../src/types/weather';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('searchCities', () => {
  it('retorna lista vazia sem chamar a rede para input vazio', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities(' \t ')).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('codifica o nome e mapeia resultados para City', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          results: [
            {
              id: 3448439,
              name: 'São Paulo',
              latitude: -23.55,
              longitude: -46.63,
              admin1: 'São Paulo',
              country: 'Brasil',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('  São Paulo  ')).resolves.toEqual([
      {
        id: 3448439,
        name: 'São Paulo',
        latitude: -23.55,
        longitude: -46.63,
        admin1: 'São Paulo',
        country: 'Brasil',
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://geocoding-api.open-meteo.com/v1/search?name=S%C3%A3o%20Paulo&count=10&language=pt&format=json',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it('preserva caracteres especiais no parâmetro de geocoding', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ results: [] }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const query = "São João-d'Ávila";

    await searchCities(query);

    expect(new URL(String(fetchMock.mock.calls[0]?.[0])).searchParams.get('name')).toBe(query);
  });

  it('retorna lista vazia para geocoding sem resultados', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ results: [] }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('Cidade inexistente')).resolves.toEqual([]);
    await expect(searchCities('Outra cidade inexistente')).resolves.toEqual([]);
  });

  it('retorna lista vazia para resposta de geocoding sem results ou com lista vazia', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(new Response('{}', { status: 200 }))
        .mockResolvedValueOnce(new Response(JSON.stringify({ results: [] }), { status: 200 })),
    );

    await expect(searchCities('Cidade inexistente')).resolves.toEqual([]);
    await expect(searchCities('Outra cidade inexistente')).resolves.toEqual([]);
  });

  it('lança WeatherServiceError com o status HTTP quando a API responde não-ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(new Response('', { status: 503, statusText: 'Service Unavailable' })),
    );

    const result = await searchCities('Lisboa').catch((error: unknown) => error);

    expect(result).toBeInstanceOf(WeatherServiceError);
    expect(result).toMatchObject({ code: 'api', status: 503 });
  });

  it('classifica falha de rede e JSON inválido', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    await expect(searchCities('Lisboa')).rejects.toMatchObject({
      code: 'network',
      message:
        'Não foi possível conectar ao serviço de busca. Verifique sua conexão e tente novamente.',
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('{invalid json', { status: 200 })),
    );
    await expect(searchCities('Lisboa')).rejects.toMatchObject({
      code: 'invalid-response',
    });
  });

  it('converte AbortError do timeout em WeatherServiceError', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(
      (_input: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener(
            'abort',
            () => reject(new DOMException('Aborted', 'AbortError')),
            { once: true },
          );
        }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const request = searchCities('Lisboa');
    const rejection = expect(request).rejects.toMatchObject({
      name: 'WeatherServiceError',
      code: 'timeout',
      message: 'A consulta excedeu o limite de 10 segundos. Tente novamente.',
    });
    await vi.advanceTimersByTimeAsync(10_000);
    await rejection;
  });
});

describe('getWeather', () => {
  const city: City = {
    id: 3448439,
    name: 'São Paulo',
    admin1: 'São Paulo',
    country: 'Brasil',
    latitude: -23.55,
    longitude: -46.63,
  };

  it('mapeia current e arrays paralelos de daily para cinco ForecastDay', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          timezone: 'America/Sao_Paulo',
          current: {
            time: '2026-09-30T14:00',
            temperature_2m: 23.4,
            weather_code: 3,
            relative_humidity_2m: 62,
            wind_speed_10m: 14.2,
            precipitation: null,
            surface_pressure: 1013.2,
          },
          daily: {
            time: ['2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'],
            weather_code: [3, 2, 61, 3, 1],
            temperature_2m_min: [18.2, 17.9, 18, 18.4, 19],
            temperature_2m_max: [27.1, 26.5, 24.3, 27.6, 28.2],
            precipitation_probability_max: [10, 20, 70, 15, 5],
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const weather = await getWeather(city);

    expect(weather.city).toEqual(city);
    expect(weather.current).toEqual({
      temperatureC: 23.4,
      weatherCode: 3,
      observedAt: '2026-09-30T14:00',
      humidityPercent: 62,
      windSpeedKmh: 14.2,
      precipitationMm: null,
      pressureHpa: 1013.2,
    });
    expect(weather.forecast).toHaveLength(5);
    expect(weather.forecast[2]).toEqual({
      date: '2026-10-02',
      weatherCode: 61,
      temperatureMinC: 18,
      temperatureMaxC: 24.3,
      precipitationProbabilityPercent: 70,
    });
    expect(weather.forecastComplete).toBe(true);

    const requestUrl = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(requestUrl.searchParams.get('current')).toContain('relative_humidity_2m');
    expect(requestUrl.searchParams.get('daily')).toContain('precipitation_probability_max');
    expect(requestUrl.searchParams.get('forecast_days')).toBe('5');
  });

  it('lança WeatherServiceError quando o endpoint de forecast retorna HTTP não-ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ reason: 'unavailable' }), { status: 503 }),
        ),
    );

    await expect(getWeather(city)).rejects.toMatchObject({
      name: 'WeatherServiceError',
      code: 'api',
      status: 503,
    });
  });

  it('converte falha de rede no endpoint de forecast em WeatherServiceError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));

    await expect(getWeather(city)).rejects.toMatchObject({
      name: 'WeatherServiceError',
      code: 'network',
      message:
        'Não foi possível conectar ao serviço meteorológico. Verifique sua conexão e tente novamente.',
    });
  });

  it('converte AbortError por timeout do forecast em WeatherServiceError', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(
      (_input: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener(
            'abort',
            () => reject(new DOMException('Aborted', 'AbortError')),
            { once: true },
          );
        }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const request = getWeather(city);
    const rejection = expect(request).rejects.toMatchObject({
      name: 'WeatherServiceError',
      code: 'timeout',
      message: 'A consulta excedeu o limite de 10 segundos. Tente novamente.',
    });
    await vi.advanceTimersByTimeAsync(10_000);
    await rejection;
  });

  it('preserva dados disponíveis e marca resposta diária parcial sem inferir valores', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            timezone: 'America/Sao_Paulo',
            current: {
              time: '2026-09-30T14:00',
              temperature_2m: 22,
              weather_code: 1,
            },
            daily: {
              time: ['2026-09-30', '2026-10-01'],
              weather_code: [1, 2],
              temperature_2m_min: [15, 16],
              temperature_2m_max: [24, 25],
            },
          }),
          { status: 200 },
        ),
      ),
    );

    const result = await getWeather(city);

    expect(result.current.temperatureC).toBe(22);
    expect(result.forecast).toHaveLength(2);
    expect(result.forecast[0]?.precipitationProbabilityPercent).toBeNull();
    expect(result.forecastComplete).toBe(false);
  });

  it('mapeia campos opcionais ausentes como null e descarta dias sem dados', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            timezone: 'America/Sao_Paulo',
            current: { temperature_2m: 20, time: 'horário inválido', weather_code: '1' },
            daily: {
              time: ['2026-09-30', '2026-10-01'],
              weather_code: [null, 1],
              temperature_2m_max: [null, 22],
            },
          }),
          { status: 200 },
        ),
      ),
    );

    const result = await getWeather(city);

    expect(result.current).toEqual({
      temperatureC: 20,
      weatherCode: null,
      observedAt: null,
      humidityPercent: null,
      windSpeedKmh: null,
      precipitationMm: null,
      pressureHpa: null,
    });
    expect(result.forecast).toEqual([
      {
        date: '2026-10-01',
        weatherCode: 1,
        temperatureMinC: null,
        temperatureMaxC: 22,
        precipitationProbabilityPercent: null,
      },
    ]);
    expect(result.forecastComplete).toBe(false);
  });

  it('preserva alinhamento por índice quando arrays diários têm comprimentos diferentes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            timezone: 'America/Sao_Paulo',
            current: {
              time: '2026-09-30T14:00',
              temperature_2m: 22,
            },
            daily: {
              time: ['2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'],
              weather_code: [1, 2],
              temperature_2m_min: [15, 16, 17],
              temperature_2m_max: [24, 25, 26, 27],
              precipitation_probability_max: [10],
            },
          }),
          { status: 200 },
        ),
      ),
    );

    const result = await getWeather(city);

    expect(result.forecast).toHaveLength(4);
    expect(result.forecast[0]).toMatchObject({ weatherCode: 1, temperatureMinC: 15 });
    expect(result.forecast[1]).toMatchObject({ weatherCode: 2, temperatureMinC: 16 });
    expect(result.forecast[3]).toMatchObject({
      weatherCode: null,
      temperatureMinC: null,
      temperatureMaxC: 27,
      precipitationProbabilityPercent: null,
    });
    expect(result.forecastComplete).toBe(false);
  });

  it('preserva a previsão quando toda a seção current está ausente', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            timezone: 'America/Sao_Paulo',
            daily: {
              time: ['2026-09-30'],
              weather_code: [1],
              temperature_2m_min: [15],
              temperature_2m_max: [24],
              precipitation_probability_max: [10],
            },
          }),
          { status: 200 },
        ),
      ),
    );

    const result = await getWeather(city);
    expect(result.current).toEqual({
      temperatureC: null,
      weatherCode: null,
      observedAt: null,
      humidityPercent: null,
      windSpeedKmh: null,
      precipitationMm: null,
      pressureHpa: null,
    });
    expect(result.forecast).toHaveLength(1);
    expect(result.forecastComplete).toBe(false);
  });

  it('preserva o clima atual quando toda a seção daily está ausente', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            timezone: 'America/Sao_Paulo',
            current: { temperature_2m: 20 },
          }),
          { status: 200 },
        ),
      ),
    );

    const result = await getWeather(city);
    expect(result.current.temperatureC).toBe(20);
    expect(result.forecast).toEqual([]);
    expect(result.forecastComplete).toBe(false);
  });
});
