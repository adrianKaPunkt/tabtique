'use client';

import type { EventProps } from 'react-big-calendar';
import { cn } from '@/lib/utils';
import { CalEvent, statusClasses } from '@/lib/constants/calendar';

const CalendarEvent = ({ event }: EventProps<CalEvent>) => {
  const status = event.status ?? 'new';
  const color = statusClasses[status];

  return (
    <div
      className={cn(
        'group w-full h-full rounded-lg px-2 py-1 text-[11px] text-white shadow-sm transition-colors flex min-w-0 flex-col justify-center',
        color,
      )}
      title={
        event.location ? `${event.title} - ${event.location}` : event.title
      }>
      <div className="w-full font-medium">{event.title}</div>
      {event.location ? (
        <div className="w-full text-[10px] font-normal">{event.location}</div>
      ) : null}
    </div>
  );
};

export default CalendarEvent;
