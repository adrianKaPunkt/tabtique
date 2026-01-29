import type { CalendarRequestEvent } from '@/lib/constants/calendar';
import { isTreatmentStatus } from '@/lib/constants/treatments';

export function mapToCalendarEvents(
  rows: Array<{
    id: string;
    createdAt: Date;
    status: string;

    name: string;
    email: string;
    phone: string;
    message: string | null;

    requestedAt: Date;
    durationSnapshotMin: number;

    priceSnapshotCents: number;

    treatmentOfferingId: string;
    treatmentType: string;
    variant: string; // bei dir: Label der Variante
  }>,
): CalendarRequestEvent[] {
  return rows.map((r) => {
    const start =
      r.requestedAt instanceof Date ? r.requestedAt : new Date(r.requestedAt);
    const end = new Date(start.getTime() + r.durationSnapshotMin * 60_000);

    const status = isTreatmentStatus(r.status) ? r.status : 'new';

    return {
      id: r.id,
      title: `${r.treatmentType} – ${r.variant}`,
      start: start.toISOString(),
      end: end.toISOString(),

      status,

      createdAt: r.createdAt.toISOString(),
      name: r.name,
      email: r.email,
      phone: r.phone,
      message: r.message,

      treatmentType: r.treatmentType,
      treatmentVariant: r.variant,
      treatmentOfferingId: r.treatmentOfferingId,

      priceSnapshotCents: r.priceSnapshotCents,
      durationSnapshotMin: r.durationSnapshotMin,
    };
  });
}
