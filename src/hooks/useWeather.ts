import { useEffect, useRef, useState } from 'react';
import { normalizeSearchQuery } from '../lib/searchQuery';
import { getWeather, searchCities } from '../services/weatherService';
import type { City, WeatherData, WeatherRequestStatus } from '../types/weather';

type LastOperation = { type: 'search'; name: string } | { type: 'selectCity'; city: City };

export interface UseWeatherResult {
  status: WeatherRequestStatus;
  data: WeatherData | null;
  cities: City[];
  error: Error | null;
  query: string;
  search: (name: string) => Promise<void>;
  selectCity: (city: City) => Promise<void>;
  retry: () => Promise<void>;
}

export function useWeather(): UseWeatherResult {
  const [status, setStatus] = useState<WeatherRequestStatus>('idle');
  const [data, setData] = useState<WeatherData | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [query, setQuery] = useState('');
  const activeController = useRef<AbortController | null>(null);
  const requestSequence = useRef(0);
  const lastOperation = useRef<LastOperation | null>(null);

  useEffect(
    () => () => {
      requestSequence.current += 1;
      activeController.current?.abort();
    },
    [],
  );

  function startRequest() {
    activeController.current?.abort();
    const controller = new AbortController();
    const requestId = requestSequence.current + 1;
    requestSequence.current = requestId;
    activeController.current = controller;
    return { controller, requestId };
  }

  function isCurrentRequest(requestId: number): boolean {
    return requestSequence.current === requestId;
  }

  function normalizeError(reason: unknown): Error {
    return reason instanceof Error
      ? reason
      : new Error('Não foi possível consultar o clima. Tente novamente.');
  }

  async function loadWeather(city: City, requestId: number, controller: AbortController) {
    lastOperation.current = { type: 'selectCity', city };
    const weather = await getWeather(city, controller.signal);
    if (!isCurrentRequest(requestId)) return;

    setData(weather);
    setError(null);
    setStatus('success');
  }

  async function search(name: string): Promise<void> {
    const normalizedName = normalizeSearchQuery(name);
    setQuery(normalizedName ?? '');
    setData(null);
    setCities([]);
    setError(null);
    lastOperation.current = normalizedName ? { type: 'search', name: normalizedName } : null;

    if (!normalizedName) {
      activeController.current?.abort();
      activeController.current = null;
      requestSequence.current += 1;
      setStatus('idle');
      return;
    }

    const { controller, requestId } = startRequest();
    setStatus('loading');

    try {
      const results = await searchCities(normalizedName, controller.signal);
      if (!isCurrentRequest(requestId)) return;

      setCities(results);
      if (results.length === 0) {
        setStatus('empty');
        return;
      }

      setStatus('idle');
    } catch (reason) {
      if (!isCurrentRequest(requestId) || controller.signal.aborted) return;
      setError(normalizeError(reason));
      setStatus('error');
    } finally {
      if (isCurrentRequest(requestId)) activeController.current = null;
    }
  }

  async function selectCity(city: City): Promise<void> {
    setData(null);
    setError(null);
    lastOperation.current = { type: 'selectCity', city };

    const { controller, requestId } = startRequest();
    setStatus('loading');

    try {
      await loadWeather(city, requestId, controller);
    } catch (reason) {
      if (!isCurrentRequest(requestId) || controller.signal.aborted) return;
      setError(normalizeError(reason));
      setStatus('error');
    } finally {
      if (isCurrentRequest(requestId)) activeController.current = null;
    }
  }

  async function retry(): Promise<void> {
    const operation = lastOperation.current;
    if (!operation) return;

    if (operation.type === 'search') {
      await search(operation.name);
      return;
    }

    await selectCity(operation.city);
  }

  return { status, data, cities, error, query, search, selectCity, retry };
}
