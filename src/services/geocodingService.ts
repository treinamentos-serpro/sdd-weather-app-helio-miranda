import { normalizeSearchQuery } from '../lib/searchQuery';
import type { City } from '../types/weather';
import { fetchWithTimeout } from './fetchWithTimeout';
import { WeatherServiceError } from './weatherServiceError';

const geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function toCity(value: unknown): City | null {
  if (!isRecord(value)) return null;

  const { id, name, latitude, longitude, admin1, country } = value;
  if (
    !isFiniteNumber(id) ||
    typeof name !== 'string' ||
    name.trim() === '' ||
    !isFiniteNumber(latitude) ||
    !isFiniteNumber(longitude)
  ) {
    return null;
  }

  return {
    id,
    name,
    latitude,
    longitude,
    admin1: typeof admin1 === 'string' ? admin1 : null,
    country: typeof country === 'string' ? country : null,
  };
}

export async function searchCities(name: string, signal?: AbortSignal): Promise<City[]> {
  const query = normalizeSearchQuery(name);
  if (!query) return [];

  try {
    const url = `${geocodingUrl}?name=${encodeURIComponent(query)}&count=10&language=pt&format=json`;
    const response = await fetchWithTimeout(url, {}, signal);

    if (!response.ok) {
      throw new WeatherServiceError(
        'O serviço de busca não conseguiu concluir a consulta. Tente novamente.',
        'api',
        response.status,
      );
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new WeatherServiceError(
        'Os dados da busca recebidos são inválidos. Tente novamente.',
        'invalid-response',
      );
    }

    if (!isRecord(payload)) {
      throw new WeatherServiceError(
        'A resposta de geocodificação tem um formato inválido.',
        'invalid-response',
      );
    }

    const results = payload.results;
    if (results === undefined) return [];
    if (!Array.isArray(results)) {
      throw new WeatherServiceError(
        'A lista de resultados de geocodificação tem um formato inválido.',
        'invalid-response',
      );
    }

    return results.flatMap((result) => {
      const city = toCity(result);
      return city ? [city] : [];
    });
  } catch (error) {
    if (error instanceof WeatherServiceError) {
      if (error.code === 'network') {
        throw new WeatherServiceError(
          'Não foi possível conectar ao serviço de busca. Verifique sua conexão e tente novamente.',
          'network',
        );
      }
      throw error;
    }
    if (signal?.aborted) throw error;
    throw new WeatherServiceError(
      'Não foi possível conectar ao serviço de busca. Verifique sua conexão e tente novamente.',
      'network',
    );
  }
}
