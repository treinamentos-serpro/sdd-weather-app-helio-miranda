import { useEffect, useRef } from 'react';
import type { City } from '../types/weather';

interface CityResultsProps {
  cities: City[];
  selectedCityId: number | null;
  onSelectCity: (city: City) => void;
}

export default function CityResults({ cities, selectedCityId, onSelectCity }: CityResultsProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (cities.length > 0) headingRef.current?.focus();
  }, [cities]);

  if (cities.length === 0) return null;

  return (
    <section aria-label="Resultados de cidades" className="min-w-0 space-y-3">
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-sm font-medium text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
      >
        Cidades encontradas
      </h2>
      <ul className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((city) => {
          const isSelected = city.id === selectedCityId;
          const context = [city.admin1, city.country].filter(Boolean).join(', ');

          return (
            <li key={city.id} className="min-w-0">
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelectCity(city)}
                className={`flex min-h-14 w-full min-w-0 items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 ${isSelected ? 'border-accent-400 bg-accent-500/15 text-white' : 'border-white/10 bg-white/5 text-white hover:bg-white/10'}`}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{city.name}</span>
                  {context && (
                    <span className="block truncate text-sm text-white/75">{context}</span>
                  )}
                </span>
                <span aria-hidden="true" className="shrink-0 text-sm text-white/75">
                  {isSelected ? 'Selecionada' : 'Ver clima'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
