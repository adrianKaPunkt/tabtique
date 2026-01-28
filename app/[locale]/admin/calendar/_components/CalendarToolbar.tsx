'use client';

import { cn } from '@/lib/utils';
import type { ToolbarProps, View, Event } from 'react-big-calendar';

const LABELS: Record<string, string> = {
  month: 'Monat',
  week: 'Woche',
  day: 'Tag',
  agenda: 'Agenda',
};

const CalendarToolbar = <TEvent extends Event>(
  props: ToolbarProps<TEvent, object>,
) => {
  const { label, view, views, onNavigate, onView } = props;
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <button
          className="rounded-md border px-3 py-1 text-sm cursor-pointer"
          onClick={() => onNavigate('PREV')}
          type="button">
          {'<-'}
        </button>
        <button
          className="rounded-md border px-3 py-1 text-sm"
          onClick={() => onNavigate('TODAY')}
          type="button">
          Heute
        </button>
        <button
          className="rounded-md border px-3 py-1 text-sm"
          onClick={() => onNavigate('NEXT')}
          type="button">
          {'->'}
        </button>
      </div>
      <div className="text-base font-semibold">{label}</div>
      <div className="flex items-center gap-2">
        {(Array.isArray(views)
          ? views
          : Object.keys(views ?? {}).filter((v) => views?.[v as View])
        ).map((v) => (
          <button
            key={String(v)}
            className={cn(
              'rounded-md border px-3 py-1 text-sm',
              v === view ? 'bg-black text-white' : '',
            )}
            onClick={() => onView(v as View)}
            type="button">
            {LABELS[v as View] ?? String(v)}
          </button>
        ))}
      </div>
    </div>
  );
};
export default CalendarToolbar;
