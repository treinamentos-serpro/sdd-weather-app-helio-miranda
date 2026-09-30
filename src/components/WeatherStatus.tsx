import type { WeatherRequestStatus } from '../types/weather';
import EmptyState from './states/EmptyState';
import ErrorState from './states/ErrorState';
import LoadingState from './states/LoadingState';

interface WeatherStatusProps {
  status: WeatherRequestStatus;
  error: Error | null;
  hasCities: boolean;
  onRetry: () => void;
}

export default function WeatherStatus({ status, error, hasCities, onRetry }: WeatherStatusProps) {
  switch (status) {
    case 'idle':
      return (
        <EmptyState
          title={hasCities ? 'Selecione uma cidade' : 'Nenhuma cidade selecionada'}
          hint={
            hasCities
              ? 'Escolha uma opção nos resultados para consultar o clima.'
              : 'Pesquise uma cidade para consultar o clima.'
          }
        />
      );
    case 'loading':
      return <LoadingState message="Buscando clima..." />;
    case 'empty':
      return (
        <EmptyState
          title="Nenhuma cidade encontrada"
          hint="Confira o nome e tente pesquisar novamente."
        />
      );
    case 'error':
      return (
        <ErrorState
          message={error?.message ?? 'Não foi possível carregar os dados meteorológicos.'}
          onRetry={onRetry}
        />
      );
    case 'success':
      return null;
  }
}
