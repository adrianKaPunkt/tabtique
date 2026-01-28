import type { CalendarRequestEvent, CalEvent } from '@/lib/constants/calendar';

export function toRbcEvents(events: CalendarRequestEvent[]): CalEvent[] {
  return events.map((e) => ({
    ...e,
    start: new Date(e.start),
    end: new Date(e.end),
  }));
}
