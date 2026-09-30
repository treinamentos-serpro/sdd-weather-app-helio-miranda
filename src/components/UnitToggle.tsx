import { type KeyboardEvent, useRef } from 'react';
import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  const celsiusRef = useRef<HTMLButtonElement>(null);
  const fahrenheitRef = useRef<HTMLButtonElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();

      const nextButton =
        event.currentTarget === celsiusRef.current ? fahrenheitRef.current : celsiusRef.current;

      nextButton?.focus();
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      celsiusRef.current?.focus();
    }

    if (event.key === 'End') {
      event.preventDefault();
      fahrenheitRef.current?.focus();
    }
  }

  return (
    <div
      role="group"
      aria-label="Unidade de temperatura"
      className="inline-flex rounded-lg border border-white/10 bg-white/5 p-1 text-white shadow-lg backdrop-blur-md"
    >
      <button
        ref={celsiusRef}
        type="button"
        aria-label="Celsius"
        aria-pressed={unit === 'celsius'}
        tabIndex={unit === 'celsius' ? 0 : -1}
        onKeyDown={handleKeyDown}
        onClick={() => onChange('celsius')}
        className={`min-h-11 min-w-11 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-night-900 ${unit === 'celsius' ? 'bg-accent-600 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
      >
        °C
      </button>
      <button
        ref={fahrenheitRef}
        type="button"
        aria-label="Fahrenheit"
        aria-pressed={unit === 'fahrenheit'}
        tabIndex={unit === 'fahrenheit' ? 0 : -1}
        onKeyDown={handleKeyDown}
        onClick={() => onChange('fahrenheit')}
        className={`min-h-11 min-w-11 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-night-900 ${unit === 'fahrenheit' ? 'bg-accent-600 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
      >
        °F
      </button>
    </div>
  );
}
