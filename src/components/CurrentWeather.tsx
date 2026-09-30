import { convertTemperature } from '../lib/temperature';
import { getWeatherCodeInfo } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

function formatMetric(value: number | null, digits: number, unit: string): string {
  if (value === null || !Number.isFinite(value)) return 'Indisponível';

  return `${value.toLocaleString('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })} ${unit}`;
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const temperature = convertTemperature(current.temperatureC, unit);
  const condition = getWeatherCodeInfo(current.weatherCode);
  const temperatureUnit = unit === 'celsius' ? 'C' : 'F';
  const observedTime = current.observedAt?.match(/T(\d{2}:\d{2})/)?.[1];
  const cityContext = [city.admin1, city.country].filter(Boolean).join(', ');
  const metrics = [
    { label: 'Umidade', value: formatMetric(current.humidityPercent, 0, '%') },
    { label: 'Vento', value: formatMetric(current.windSpeedKmh, 1, 'km/h') },
    { label: 'Precipitação', value: formatMetric(current.precipitationMm, 1, 'mm') },
    { label: 'Pressão', value: formatMetric(current.pressureHpa, 1, 'hPa') },
  ];

  return (
    <section
      aria-label={`Clima atual em ${city.name}`}
      className="rounded-lg border border-white/10 bg-white/5 p-5 text-white shadow-lg backdrop-blur-md sm:p-6"
    >
      <header className="mb-5 min-w-0">
        <h2 className="text-lg font-semibold">{city.name}</h2>
        {cityContext && <p className="break-words text-sm text-white/75">{cityContext}</p>}
      </header>

      <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
        <span aria-hidden="true" className="text-4xl sm:text-6xl">
          {condition.icon}
        </span>
        <div className="min-w-0">
          <p
            className={`break-words font-semibold tracking-tight ${temperature === null ? 'text-3xl sm:text-5xl' : 'text-5xl sm:text-6xl'}`}
          >
            {temperature === null ? 'Indisponível' : `${temperature.toFixed(1)}°${temperatureUnit}`}
          </p>
          <p className="mt-1 break-words text-base text-white/80">{condition.description}</p>
          <p className="mt-1 text-sm text-white/75">
            Atualizado às{' '}
            {observedTime ? (
              <time dateTime={current.observedAt ?? undefined}>{observedTime}</time>
            ) : (
              'Indisponível'
            )}
          </p>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map(({ label, value }) => (
          <div key={label} className="min-w-0 rounded-lg border border-white/10 bg-white/5 p-3">
            <dt className="text-sm text-white/75">{label}</dt>
            <dd className="mt-1 break-words font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
