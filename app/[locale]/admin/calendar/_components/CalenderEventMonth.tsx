'use client';

import type { EventProps } from 'react-big-calendar';
import { cn } from '@/lib/utils';
import { CalEvent, statusClasses } from '@/lib/constants/calendar';

const CalendarEventMonth = ({ event }: EventProps<CalEvent>) => {
  const color = statusClasses[event.status ?? 'new'];

  return <div className={cn('h-3 mb-[1px] w-full rounded-full', color)} />;
};

export default CalendarEventMonth;
