import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchBar from '../../../src/components/SearchBar';

describe('SearchBar', () => {
  it('não chama onSearch ao enviar input vazio', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Informe o nome de uma cidade');
    expect(screen.getByRole('searchbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('não envia espaços e mantém o campo editável para correção', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByRole('searchbox', { name: 'Pesquisar cidade' });

    await user.type(input, '   ');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).not.toHaveBeenCalled();
    expect(input).toBeEnabled();
    expect(input).toHaveValue('   ');
  });

  it('chama onSearch com o termo preenchido', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByRole('searchbox', { name: 'Pesquisar cidade' }), 'Lisboa');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).toHaveBeenCalledOnce();
    expect(onSearch).toHaveBeenCalledWith('Lisboa');
  });

  it('limpa a mensagem de validação ao editar o campo', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    await user.type(screen.getByRole('searchbox', { name: 'Pesquisar cidade' }), 'Évora');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
