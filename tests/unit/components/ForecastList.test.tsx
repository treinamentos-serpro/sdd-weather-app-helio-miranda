import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ForecastList from '../../../src/components/ForecastList';
import type { ForecastDay } from '../../../src/types/weather';

describe('ForecastList', () => {
  it('apresenta campos disponíveis e sinaliza previsão parcial sem inventar valores', () => {
    const partialDay: ForecastDay = {
      date: '2026-09-30',
      weatherCode: 0,
      temperatureMinC: null,
      temperatureMaxC: 20,
      precipitationProbabilityPercent: null,
    };

    render(<ForecastList forecast={[partialDay]} forecastComplete={false} unit="celsius" />);

    expect(screen.getByRole('status')).toHaveTextContent('Previsão incompleta');

    const forecastRegion = screen.getByRole('region', { name: 'Previsão de 5 dias' });
    const card = within(forecastRegion).getByRole('article');
    expect(card).toHaveTextContent('Hoje');
    expect(card).toHaveTextContent('20,0°C');
    expect(within(card).getAllByText('Indisponível')).toHaveLength(2);
  });

  it('omite dias sem qualquer dado e preserva o rótulo do índice original', () => {
    const forecast: ForecastDay[] = [
      {
        date: '2026-09-30',
        weatherCode: null,
        temperatureMinC: null,
        temperatureMaxC: null,
        precipitationProbabilityPercent: null,
      },
      {
        date: '2026-10-01',
        weatherCode: 0,
        temperatureMinC: 12,
        temperatureMaxC: 21,
        precipitationProbabilityPercent: 20,
      },
    ];

    render(<ForecastList forecast={forecast} forecastComplete={false} unit="celsius" />);

    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(1);
    expect(cards[0]).toHaveTextContent('Amanhã');
    expect(screen.getByRole('status')).toHaveTextContent('Previsão incompleta');
  });

  it('informa previsão indisponível quando nenhum dia possui dados válidos', () => {
    render(
      <ForecastList
        forecast={[
          {
            date: '2026-09-30',
            weatherCode: null,
            temperatureMinC: null,
            temperatureMaxC: null,
            precipitationProbabilityPercent: null,
          },
        ]}
        forecastComplete={false}
        unit="celsius"
      />,
    );

    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(screen.getByText('Previsão indisponível.')).toBeInTheDocument();
  });
});
