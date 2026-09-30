import { type FormEvent, useId, useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const inputId = useId();
  const hintId = useId();
  const [query, setQuery] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const city = query.trim();
    if (!city) {
      setValidationMessage('Informe o nome de uma cidade para pesquisar.');
      return;
    }

    setValidationMessage('');
    onSearch(city);
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-white shadow-lg backdrop-blur-md sm:flex-row sm:items-end"
    >
      <div className="min-w-0 flex-1">
        <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-white/80">
          Pesquisar cidade
        </label>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            if (validationMessage) setValidationMessage('');
          }}
          disabled={disabled}
          placeholder="Ex.: São Paulo"
          aria-invalid={validationMessage ? true : undefined}
          aria-describedby={validationMessage ? hintId : undefined}
          className="min-h-11 w-full rounded-lg border border-white/15 bg-night-800/80 px-3 py-2 text-white placeholder:text-white/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {validationMessage && (
          <p id={hintId} role="alert" className="mt-1 text-sm text-rose-200">
            {validationMessage}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="min-h-11 rounded-lg bg-accent-600 px-4 py-2 font-medium text-white transition-colors hover:bg-accent-500 hover:text-night-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-night-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Buscar
      </button>
    </form>
  );
}
