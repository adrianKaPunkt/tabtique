export type DateParts = {
  year: number;
  month: number;
  day: number;
  weekdayIndex: number;
  weekday: string;
  monthName: string;
  isoDate: string;
};

/**
 * '2023-08-15' to Date object
 * @param isoDate string in format YYYY-MM-DD
 * @returns Date | null
 */
export function parseLocalDate(isoDate: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!m) return null;

  const year = Number(m[1]);
  const month = Number(m[2]) - 1;
  const day = Number(m[3]);

  const date = new Date(year, month, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function getDateParts(
  isoDate: string,
  locale: string = 'de-DE',
): DateParts | null {
  const date = parseLocalDate(isoDate);
  if (!date) return null;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdayIndex = date.getDay(); // 0 (Sun) - 6 (Sat)

  const weekday = date.toLocaleDateString(locale, { weekday: 'long' });
  const monthName = date.toLocaleDateString(locale, { month: 'long' });

  return {
    year,
    month,
    day,
    weekdayIndex,
    weekday,
    monthName,
    isoDate: isoDate,
  };
}

/**
 * 'Returns today's date as YYYY-MM-DD in a given timezone
 */
export function getTodayISO(timeZone: string = 'Europe/Berlin'): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;

  return `${year}-${month}-${day}`;
}
