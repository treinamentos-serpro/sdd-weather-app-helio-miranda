import type { ForecastDay, Unit } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  forecast: ForecastDay[];
  forecastComplete: boolean;
  unit: Unit;
}

export default function ForecastList({ forecast, forecastComplete, unit }: ForecastListProps) {
  const visibleDays = forecast.flatMap((day, dayIndex) => {
    const hasData = [
      day.weatherCode,
      day.temperatureMinC,
      day.temperatureMaxC,
      day.precipitationProbabilityPercent,
    ].some((value) => value !== null && Number.isFinite(value));

    return hasData ? [{ day, dayIndex }] : [];
  });

  if (visibleDays.length === 0) {
    return (
      <section aria-label="Previsão de 5 dias" className="space-y-2">
        {!forecastComplete && (
          <p role="status" className="text-sm text-white/70">
            Previsão incompleta
          </p>
        )}
        <p role="status" className="text-sm text-white/80">
          Previsão indisponível.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Previsão de 5 dias" className="min-w-0 space-y-3">
      {!forecastComplete && (
        <p role="status" className="text-sm text-white/70">
          Previsão incompleta
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {visibleDays.map(({ day, dayIndex }) => (
          <ForecastCard key={day.date} day={day} dayIndex={dayIndex} unit={unit} />
        ))}
      </div>
    </section>
  );
}
