import { formatForecastDayLabel, getShortDate } from '../lib/format';
import { convertTemperature } from '../lib/temperature';
import { getWeatherCodeInfo } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  dayIndex: number;
  unit: Unit;
}

function formatTemperature(temperatureC: number | null, unit: Unit): string {
  const temperature = convertTemperature(temperatureC, unit);
  if (temperature === null) return 'Indisponível';

  const number = temperature.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const symbol = unit === 'celsius' ? '°C' : '°F';

  return `${number}${symbol}`; 
}

export default function ForecastCard({ day, dayIndex, unit }: ForecastCardProps) {
  const condition = getWeatherCodeInfo(day.weatherCode);
  const rainProbability = day.precipitationProbabilityPercent;
  const rainLabel =
    rainProbability !== null && Number.isFinite(rainProbability)
      ? `${rainProbability}%`
      : 'Indisponível';

  return (
    <article className="min-w-0 rounded-lg border border-white/10 bg-white/5 p-3 text-white shadow-lg backdrop-blur-md sm:p-4">
      <h3 className="break-words text-sm font-medium capitalize text-white/85">
        {formatForecastDayLabel(day.date, dayIndex)}
      </h3>
      <p className="mt-1 text-xs text-white/75">{getShortDate(day.date)}</p>
      <div className="mt-3 flex min-w-0 items-start gap-2">
        <span aria-hidden="true" className="shrink-0 text-3xl">
          {condition.icon}
        </span>
        <p className="min-w-0 break-words text-sm text-white/80">{condition.description}</p>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
        <div className="min-w-0">
          <dt className="text-white/75">Máx.</dt>
          <dd className="break-words font-semibold">
            {formatTemperature(day.temperatureMaxC, unit)}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-white/75">Mín.</dt>
          <dd className="break-words font-medium">
            {formatTemperature(day.temperatureMinC, unit)}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-white/75">Chuva</dt>
          <dd className="break-words font-medium">{rainLabel}</dd>
        </div>
      </dl>
    </article>
  );
}
