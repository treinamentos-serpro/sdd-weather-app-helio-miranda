import { useState } from 'react';
import CityResults from './components/CityResults';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import UnitToggle from './components/UnitToggle';
import WeatherStatus from './components/WeatherStatus';
import { useWeather } from './hooks/useWeather';
import type { Unit } from './types/weather';

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const { status, data, cities, error, search, selectCity, retry } = useWeather();

  return (
    <div className="min-h-screen bg-night-900 text-white">
      <header className="border-b border-white/10 bg-night-900/80">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:px-8">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="text-3xl">
              🌤️
            </span>
            <div>
              <p className="font-semibold tracking-wide">Clima</p>
              <p className="text-xs text-white/75">Weather App</p>
            </div>
          </div>
          <SearchBar onSearch={(city) => void search(city)} disabled={status === 'loading'} />
          <div className="flex justify-end">
            <UnitToggle unit={unit} onChange={setUnit} />
          </div>
        </div>
      </header>

      <main
        aria-busy={status === 'loading'}
        className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
      >
        <CityResults
          cities={cities}
          selectedCityId={data?.city.id ?? null}
          onSelectCity={(city) => void selectCity(city)}
        />
        <WeatherStatus
          status={status}
          error={error}
          hasCities={cities.length > 0}
          onRetry={() => void retry()}
        />

        {status === 'success' && data && (
          <>
            <CurrentWeather city={data.city} current={data.current} unit={unit} />
            <ForecastList
              forecast={data.forecast}
              forecastComplete={data.forecastComplete}
              unit={unit}
            />
          </>
        )}
      </main>
    </div>
  );
}
