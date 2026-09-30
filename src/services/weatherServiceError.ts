export type WeatherServiceErrorCode = 'network' | 'api' | 'timeout' | 'invalid-response';

export class WeatherServiceError extends Error {
  constructor(
    message: string,
    readonly code: WeatherServiceErrorCode,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}
