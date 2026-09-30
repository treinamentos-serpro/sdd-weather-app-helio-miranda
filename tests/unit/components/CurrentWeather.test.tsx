import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CurrentWeather from '../../../src/components/CurrentWeather';
import type { City, CurrentWeather as CurrentWeatherData } from '../../../src/types/weather';

const city: City = {
  id: 3448439,
  name: 'São Paulo',
  admin1: 'São Paulo',
  country: 'Brasil',
  latitude: -23.55,
  longitude: -46.63,
};

describe('CurrentWeather', () => {
  it('mostra métricas disponíveis e marca métricas ausentes como indisponíveis', () => {
    const current: CurrentWeatherData = {
      temperatureC: 21,
      weatherCode: 1,
      observedAt: '2026-09-30T14:00',
      humidityPercent: null,
      windSpeedKmh: 12.5,
      precipitationMm: null,
      pressureHpa: 1012.4,
    };

    render(<CurrentWeather city={city} current={current} unit="celsius" />);

    const weatherRegion = screen.getByRole('region', { name: 'Clima atual em São Paulo' });
    const metricValues = within(weatherRegion)
      .getAllByRole('definition')
      .map((definition) => definition.textContent);

    expect(metricValues).toEqual(
      expect.arrayContaining(['Indisponível', '12,5 km/h', '1.012,4 hPa']),
    );
    expect(within(weatherRegion).getByText('Umidade')).toBeInTheDocument();
    expect(within(weatherRegion).getByText('Precipitação')).toBeInTheDocument();
  });

  it('mostra indisponibilidade quando o horário está ausente ou inválido', () => {
    render(
      <CurrentWeather
        city={city}
        current={{
          temperatureC: null,
          weatherCode: null,
          observedAt: null,
          humidityPercent: null,
          windSpeedKmh: null,
          precipitationMm: null,
          pressureHpa: null,
        }}
        unit="celsius"
      />,
    );

    expect(screen.getByText('Atualizado às Indisponível')).toBeInTheDocument();
    expect(screen.getByText('Condição indisponível')).toBeInTheDocument();
    expect(screen.queryByText(/NaN|undefined/)).not.toBeInTheDocument();
  });
});
