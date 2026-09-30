import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CityResults from '../../../src/components/CityResults';
import type { City } from '../../../src/types/weather';

const homonymousCities: City[] = [
  {
    id: 1,
    name: 'São Paulo',
    admin1: 'São Paulo',
    country: 'Brasil',
    latitude: -23.55,
    longitude: -46.63,
  },
  {
    id: 2,
    name: 'São Paulo',
    admin1: 'Minas Gerais',
    country: 'Brasil',
    latitude: -21.22,
    longitude: -44.98,
  },
];

describe('CityResults', () => {
  it('permite escolher a cidade homônima correta pelo contexto geográfico', async () => {
    const user = userEvent.setup();
    const onSelectCity = vi.fn();
    render(
      <CityResults cities={homonymousCities} selectedCityId={null} onSelectCity={onSelectCity} />,
    );

    expect(screen.getByRole('heading', { name: 'Cidades encontradas' })).toHaveFocus();
    const cityOptions = screen.getAllByRole('button', { name: /São Paulo/ });
    expect(cityOptions).toHaveLength(2);

    const minasGeraisOption = screen.getByRole('button', { name: /Minas Gerais/ });
    await user.click(minasGeraisOption);

    expect(onSelectCity).toHaveBeenCalledOnce();
    expect(onSelectCity).toHaveBeenCalledWith(homonymousCities[1]);
  });
});
