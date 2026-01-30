'use client';

import './calendar.css';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { de } from 'date-fns/locale';

import CalendarEvent from './CalendarEvent';
import CalendarEventMonth from './CalenderEventMonth';
import CalendarToolbar from './CalendarToolbar';

import {
  statusClasses,
  type CalendarRequestEvent,
  type CalEvent,
} from '@/lib/constants/calendar';
import { toRbcEvents } from '@/lib/calendar/toRbcEvents';
import TreatmentRequestModal from '@/components/TreatmentRequestModal';
import type { TreatmentOfferingDTO } from '@/lib/server/getTreatmentOfferingsWithAddons';
import type { TreatmentStatusDTO } from '@/lib/server/getTreatmentStatus';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { de },
});

interface BigCalendarClientProps {
  events: CalendarRequestEvent[];
  offerings: TreatmentOfferingDTO[];
  statuses: TreatmentStatusDTO[];
}

const BigCalendarClient = ({
  events,
  offerings,
  statuses,
}: BigCalendarClientProps) => {
  const router = useRouter();

  // falls toRbcEvents bei dir schon memoisiert ist, kannst du es so lassen
  const rbcEvents = useMemo(() => toRbcEvents(events), [events]);

  const [selected, setSelected] = useState<CalEvent | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ height: '90vh' }}>
      <Calendar
        localizer={localizer}
        events={rbcEvents}
        startAccessor="start"
        endAccessor="end"
        culture="de"
        views={['month', 'week', 'day', 'agenda'] as View[]}
        defaultView="month"
        onSelectEvent={(ev) => {
          setSelected(ev as CalEvent);
          setModalOpen(true);
        }}
        eventPropGetter={(ev) => {
          const e = ev as CalEvent;
          const cls = statusClasses[e.status];
          return { className: cls };
        }}
        components={{
          toolbar: CalendarToolbar,
          event: CalendarEvent,
          month: { event: CalendarEventMonth },
        }}
      />

      <TreatmentRequestModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        event={selected}
        offerings={offerings}
        statuses={statuses}
        onSaved={() => {
          // Serverdaten neu holen, ohne lokalen State/Architektur zu bauen
          router.refresh();
        }}
      />
    </div>
  );
};

export default BigCalendarClient;
