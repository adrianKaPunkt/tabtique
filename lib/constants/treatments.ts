export const TREATMENT_STATUS = [
  'new',
  'confirmed',
  'rescheduled',
  'cancelled',
  'done',
  'noshow',
] as const;

export type TreatmentStatus = (typeof TREATMENT_STATUS)[number];

export function isTreatmentStatus(x: string): x is TreatmentStatus {
  return (TREATMENT_STATUS as readonly string[]).includes(x);
}
