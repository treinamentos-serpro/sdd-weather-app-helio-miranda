import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import WeatherStatus from '../../../src/components/WeatherStatus';

describe('WeatherStatus', () => {
  it('anuncia o estado loading', () => {
    render(<WeatherStatus status="loading" error={null} hasCities={false} onRetry={vi.fn()} />);

    expect(screen.getByRole('status')).toHaveTextContent('Buscando clima...');
  });

  it('apresenta o estado vazio da busca', () => {
    render(<WeatherStatus status="empty" error={null} hasCities={false} onRetry={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('Confira o nome');
  });

  it('anuncia erro e aciona retry quando solicitado', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <WeatherStatus
        status="error"
        error={new Error('Falha de rede.')}
        hasCities={false}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Falha de rede.');
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});
