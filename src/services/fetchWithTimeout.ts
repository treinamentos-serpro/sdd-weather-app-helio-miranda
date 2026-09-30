import { WeatherServiceError } from './weatherServiceError';

const requestTimeoutMs = 10_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isAbortError(error: unknown): boolean {
  return (
    (error instanceof Error && error.name === 'AbortError') ||
    (isRecord(error) && error.name === 'AbortError')
  );
}

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  signal?: AbortSignal,
): Promise<Response> {
  const controller = new AbortController();
  let timedOut = false;
  const abortFromCaller = () => controller.abort();

  if (signal?.aborted) {
    controller.abort();
  } else {
    signal?.addEventListener('abort', abortFromCaller, { once: true });
  }

  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, requestTimeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (signal?.aborted && !timedOut) throw error;
    if (timedOut || isAbortError(error)) {
      throw new WeatherServiceError(
        'A consulta excedeu o limite de 10 segundos. Tente novamente.',
        'timeout',
      );
    }
    throw new WeatherServiceError(
      'Não foi possível conectar ao serviço. Verifique sua conexão e tente novamente.',
      'network',
    );
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', abortFromCaller);
  }
}
