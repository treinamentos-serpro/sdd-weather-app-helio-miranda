import { describe, expect, it } from 'vitest';
import { formatForecastDayLabel, getShortDate } from '../../src/lib/format';

describe('formatForecastDayLabel', () => {
  it('usa rótulos relativos para hoje e amanhã', () => {
    expect(formatForecastDayLabel('2026-09-30', 0)).toBe('Hoje');
    expect(formatForecastDayLabel('2026-10-01', 1)).toBe('Amanhã');
  });

  it('usa o dia da semana para os dias seguintes', () => {
    expect(formatForecastDayLabel('2026-10-02', 2)).toBe('sexta-feira');
  });

  it('retorna fallback para data inválida', () => {
    expect(formatForecastDayLabel('2026-02-30', 2)).toBe('Data indisponível');
  });
});

describe('getShortDate', () => {
  it('formata a data como dia/mês', () => {
    expect(getShortDate('2026-09-30')).toBe('30/09');
  });

  it('retorna fallback para data inválida', () => {
    expect(getShortDate('not-a-date')).toBe('Data indisponível');
  });
});
