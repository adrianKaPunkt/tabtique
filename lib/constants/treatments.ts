export const TREATMENTS = [
  'signature',
  'microneedling',
  'aquafacial',
  'ultimate',
] as const;

export type Treatment = (typeof TREATMENTS)[number];

export const TREATMENT_LABELS = {
  signature: 'Signature Combination',
  microneedling: 'Microneedling Treatment',
  aquafacial: 'Aqua Treatment',
  ultimate: 'Ultimate Treatment',
} satisfies Record<Treatment, string>;

export const TREATMENT_VARIANTS = ['basic', 'exo', 'dna', 'pdx'] as const;

export type TreatmentVariant = (typeof TREATMENT_VARIANTS)[number];

export const TREATMENT_VARIANT_LABELS = {
  basic: 'Basic',
  exo: 'Cica Aqua EXO',
  dna: 'Salmon DNA',
  pdx: 'PDX Exosomen Premium',
} satisfies Record<TreatmentVariant, string>;

export const REQUEST_STATUSES = [
  'new',
  'read',
  'pending',
  'accepted',
  'denied',
  'archived',
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const REQUEST_STATUS_LABELS = {
  new: 'Neu',
  read: 'Gelesen',
  pending: 'In Prüfung',
  accepted: 'Angenommen',
  denied: 'Abgelehnt',
  archived: 'Archiviert',
} satisfies Record<RequestStatus, string>;

export const VARIANTS_BY_TREATMENT: Record<
  Treatment,
  readonly TreatmentVariant[]
> = {
  signature: ['exo', 'dna'],
  microneedling: ['exo', 'dna', 'pdx'],
  aquafacial: ['dna'],
  ultimate: ['exo', 'dna', 'pdx'],
} as const;

export type VariantsFor<T extends Treatment> =
  (typeof VARIANTS_BY_TREATMENT)[T][number];

export function getVariantsForTreatment<T extends Treatment>(treatment: T) {
  return VARIANTS_BY_TREATMENT[treatment];
}
