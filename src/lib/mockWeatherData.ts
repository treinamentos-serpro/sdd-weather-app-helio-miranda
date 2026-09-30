import type { WeatherData } from '../types/weather';

export const mockWeatherData: WeatherData = {
  city: {
    id: 3448439,
    name: 'São Paulo',
    admin1: 'São Paulo',
    country: 'Brasil',
    latitude: -23.55,
    longitude: -46.63,
  },
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
  forecast: [
    {
      date: '2026-09-30',
      weatherCode: 3,
      temperatureMinC: 18.2,
      temperatureMaxC: 27.1,
      precipitationProbabilityPercent: 10,
    },
    {
      date: '2026-10-01',
      weatherCode: 2,
      temperatureMinC: 17.9,
      temperatureMaxC: 26.5,
      precipitationProbabilityPercent: 20,
    },
    {
      date: '2026-10-02',
      weatherCode: 61,
      temperatureMinC: 18,
      temperatureMaxC: 24.3,
      precipitationProbabilityPercent: 70,
    },
    {
      date: '2026-10-03',
      weatherCode: 3,
      temperatureMinC: 18.4,
      temperatureMaxC: 27.6,
      precipitationProbabilityPercent: 15,
    },
    {
      date: '2026-10-04',
      weatherCode: 1,
      temperatureMinC: 19,
      temperatureMaxC: 28.2,
      precipitationProbabilityPercent: 5,
    },
  ],
  forecastComplete: true,
};
