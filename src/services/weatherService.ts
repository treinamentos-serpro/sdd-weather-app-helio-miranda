import type { City, CurrentWeather, ForecastDay, WeatherData } from '../types/weather';
import { fetchWithTimeout } from './fetchWithTimeout';
import { WeatherServiceError } from './weatherServiceError';

export { searchCities } from './geocodingService';
export type { WeatherServiceErrorCode } from './weatherServiceError';
export { WeatherServiceError };

const forecastUrl = 'https://api.open-meteo.com/v1/forecast';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function numberAt(values: unknown, index: number, min = -Infinity, max = Infinity): number | null {
  if (!Array.isArray(values)) return null;

  const value: unknown = values[index];
  return isFiniteNumber(value) && value >= min && value <= max ? value : null;
}

function integerAt(values: unknown, index: number): number | null {
  const value = numberAt(values, index);
  return value !== null && Number.isInteger(value) ? value : null;
}

function isCalendarDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isLocalDateTime(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return false;
  if (!isCalendarDate(value.slice(0, 10))) return false;

  const hour = Number(value.slice(11, 13));
  const minute = Number(value.slice(14, 16));
  return hour <= 23 && minute <= 59;
}

function hasFiveConsecutiveCompleteDays(
  forecast: ForecastDay[],
  firstDate: string | null,
): boolean {
  if (forecast.length !== 5 || firstDate === null || forecast[0]?.date !== firstDate) return false;

  return forecast.every((day, index) => {
    if (
      day.weatherCode === null ||
      day.temperatureMinC === null ||
      day.temperatureMaxC === null ||
      day.precipitationProbabilityPercent === null
    ) {
      return false;
    }

    if (index === 0) return true;
    const previousDate = forecast[index - 1]?.date;
    if (!previousDate) return false;

    const previousDay = new Date(`${previousDate}T00:00:00.000Z`);
    previousDay.setUTCDate(previousDay.getUTCDate() + 1);
    return previousDay.toISOString().slice(0, 10) === day.date;
  });
}

export async function getWeather(city: City, signal?: AbortSignal): Promise<WeatherData> {
  try {
    const params = new URLSearchParams({
      latitude: String(city.latitude),
      longitude: String(city.longitude),
      current:
        'temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,precipitation,surface_pressure',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      temperature_unit: 'celsius',
      wind_speed_unit: 'kmh',
      timezone: 'auto',
      forecast_days: '5',
    });
    const response = await fetchWithTimeout(`${forecastUrl}?${params.toString()}`, {}, signal);

    if (!response.ok) {
      throw new WeatherServiceError(
        'O serviço meteorológico não conseguiu concluir a consulta. Tente novamente.',
        'api',
        response.status,
      );
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new WeatherServiceError(
        'Os dados meteorológicos recebidos são inválidos. Tente novamente.',
        'invalid-response',
      );
    }

    if (!isRecord(payload)) {
      throw new WeatherServiceError(
        'A resposta meteorológica não contém os dados atuais e diários.',
        'invalid-response',
      );
    }

    const currentValue = payload.current;
    const dailyValue = payload.daily;
    if (
      (currentValue !== undefined && currentValue !== null && !isRecord(currentValue)) ||
      (dailyValue !== undefined && dailyValue !== null && !isRecord(dailyValue))
    ) {
      throw new WeatherServiceError(
        'A resposta meteorológica não contém os dados atuais e diários.',
        'invalid-response',
      );
    }

    const currentPayload = isRecord(currentValue) ? currentValue : {};
    const dailyPayload = isRecord(dailyValue) ? dailyValue : {};
    const timezone = payload.timezone;
    const dailyTimes = Array.isArray(dailyPayload.time) ? dailyPayload.time : [];
    if (
      typeof timezone !== 'string' ||
      !timezone ||
      (dailyPayload.time !== undefined &&
        dailyPayload.time !== null &&
        !Array.isArray(dailyPayload.time))
    ) {
      throw new WeatherServiceError(
        'A resposta meteorológica tem timezone ou datas diárias inválidos.',
        'invalid-response',
      );
    }

    const observedAt = isLocalDateTime(currentPayload.time) ? currentPayload.time : null;
    const current: CurrentWeather = {
      temperatureC: isFiniteNumber(currentPayload.temperature_2m)
        ? currentPayload.temperature_2m
        : null,
      weatherCode:
        isFiniteNumber(currentPayload.weather_code) && Number.isInteger(currentPayload.weather_code)
          ? currentPayload.weather_code
          : null,
      observedAt,
      humidityPercent: numberAt([currentPayload.relative_humidity_2m], 0, 0, 100),
      windSpeedKmh: numberAt([currentPayload.wind_speed_10m], 0, 0),
      precipitationMm: numberAt([currentPayload.precipitation], 0, 0),
      pressureHpa: numberAt([currentPayload.surface_pressure], 0, 0),
    };

    const forecast = dailyTimes.flatMap((date, index): ForecastDay[] => {
      if (!isCalendarDate(date)) return [];

      const day: ForecastDay = {
        date,
        weatherCode: integerAt(dailyPayload.weather_code, index),
        temperatureMinC: numberAt(dailyPayload.temperature_2m_min, index),
        temperatureMaxC: numberAt(dailyPayload.temperature_2m_max, index),
        precipitationProbabilityPercent: numberAt(
          dailyPayload.precipitation_probability_max,
          index,
          0,
          100,
        ),
      };
      const hasData = [
        day.weatherCode,
        day.temperatureMinC,
        day.temperatureMaxC,
        day.precipitationProbabilityPercent,
      ].some((value) => value !== null);

      return hasData ? [day] : [];
    });

    const hasUsableCurrent = Object.values(current).some((value) => value !== null);
    const hasUsableForecast = forecast.some((day) =>
      [
        day.weatherCode,
        day.temperatureMinC,
        day.temperatureMaxC,
        day.precipitationProbabilityPercent,
      ].some((value) => value !== null),
    );

    if (!hasUsableCurrent && !hasUsableForecast) {
      throw new WeatherServiceError(
        'Os dados meteorológicos estão indisponíveis. Tente novamente.',
        'invalid-response',
      );
    }

    const firstDate =
      observedAt && isCalendarDate(observedAt.slice(0, 10)) ? observedAt.slice(0, 10) : null;

    return {
      city,
      timezone,
      current,
      forecast,
      forecastComplete: hasFiveConsecutiveCompleteDays(forecast, firstDate),
    };
  } catch (error) {
    if (error instanceof WeatherServiceError) {
      if (error.code === 'network') {
        throw new WeatherServiceError(
          'Não foi possível conectar ao serviço meteorológico. Verifique sua conexão e tente novamente.',
          'network',
        );
      }
      throw error;
    }
    if (signal?.aborted) throw error;
    throw new WeatherServiceError(
      'Não foi possível conectar ao serviço meteorológico. Verifique sua conexão e tente novamente.',
      'network',
    );
  }
}
