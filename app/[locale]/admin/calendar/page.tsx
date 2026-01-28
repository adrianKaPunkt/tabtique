import { mapToCalendarEvents } from '@/lib/calendar/mapToCalendarEvents';
import BigCalendarClient from './_components/BigCalendarClient';
import { getTreatmentRequests } from '@/lib/server/getTreatmentRequests';
import { getTreatmentOfferings } from '@/lib/server/getTreatmentOfferings';

export default async function CalendarPage() {
  const rows = await getTreatmentRequests({ limit: 200 });
  const events = mapToCalendarEvents(rows);
  const offerings = await getTreatmentOfferings();

  return (
    <main className="p-6">
      <BigCalendarClient events={events} offerings={offerings} />
    </main>
  );
}
