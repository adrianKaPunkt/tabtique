import type { TreatmentStatus } from './treatments';

export type CalEvent = Omit<CalendarRequestEvent, 'start' | 'end'> & {
  start: Date;
  end: Date;
};

export const statusClasses: Record<TreatmentStatus, string> = {
  new: 'bg-blue-600 hover:bg-blue-500',
  confirmed: 'bg-green-600 hover:bg-green-500',
  cancelled: 'bg-red-600 hover:bg-red-500',
  done: 'bg-neutral-400',
  noshow: 'bg-orange-600 hover:bg-orange-500',
};

export type CalendarRequestEvent = {
  id: string;
  title: string;
  start: string; // ISO
  end: string; // ISO
  status: TreatmentStatus;

  createdAt: string; // ISO
  name: string;
  email: string;
  phone: string;
  message: string | null;

  treatmentType: string;
  treatmentVariant: string;

  treatmentOfferingId: string;

  priceSnapshotCents: number;
  durationSnapshotMin: number;

  treatmentLabel?: string;
  variantLabel?: string;
  addons?: Array<{
    addonCode: string;
    addonLabel: string;
    isIncluded: boolean;
    priceDeltaCents: number;
    durationDeltaMin: number;
  }>;
};
