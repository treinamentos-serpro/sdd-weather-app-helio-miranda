function parseCalendarDate(date: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return null;

  const [, year, month, day] = match;
  const dateValue = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12));

  if (
    dateValue.getUTCFullYear() !== Number(year) ||
    dateValue.getUTCMonth() !== Number(month) - 1 ||
    dateValue.getUTCDate() !== Number(day)
  ) {
    return null;
  }

  return dateValue;
}

export function formatForecastDayLabel(date: string, dayIndex: number): string {
  const dateValue = parseCalendarDate(date);
  if (!dateValue) return 'Data indisponível';
  if (dayIndex === 0) return 'Hoje';
  if (dayIndex === 1) return 'Amanhã';

  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    timeZone: 'UTC',
  }).format(dateValue);
}

export function getShortDate(date: string): string {
  const dateValue = parseCalendarDate(date);
  if (!dateValue) return 'Data indisponível';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
  }).format(dateValue);
}
