import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import CurrentWeather from '../../../src/components/CurrentWeather';
import UnitToggle from '../../../src/components/UnitToggle';
import type { Unit } from '../../../src/types/weather';

function WeatherWithUnitToggle() {
  const [unit, setUnit] = useState<Unit>('celsius');

  return (
    <>
      <UnitToggle unit={unit} onChange={setUnit} />
      <CurrentWeather
        city={{
          id: 1,
          name: 'São Paulo',
          admin1: 'São Paulo',
          country: 'Brasil',
          latitude: -23.55,
          longitude: -46.63,
        }}
        current={{
          temperatureC: 0,
          weatherCode: 0,
          observedAt: '2026-09-30T12:00',
          humidityPercent: 50,
          windSpeedKmh: 10,
          precipitationMm: 0,
          pressureHpa: 1013,
        }}
        unit={unit}
      />
    </>
  );
}

describe('UnitToggle com CurrentWeather', () => {
  it('alterna 0°C para 32°F ao selecionar Fahrenheit', async () => {
    const user = userEvent.setup();
    render(<WeatherWithUnitToggle />);

    const unitGroup = screen.getByRole('group', { name: 'Unidade de temperatura' });
    const weatherRegion = screen.getByRole('region', { name: 'Clima atual em São Paulo' });

    expect(within(unitGroup).getByRole('button', { name: 'Celsius' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.click(within(unitGroup).getByRole('button', { name: 'Fahrenheit' }));

    expect(within(unitGroup).getByRole('button', { name: 'Fahrenheit' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(weatherRegion).toHaveTextContent('32.0°F');

    await user.click(within(unitGroup).getByRole('button', { name: 'Celsius' }));

    expect(within(unitGroup).getByRole('button', { name: 'Celsius' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(weatherRegion).toHaveTextContent('0.0°C');
  });
});
