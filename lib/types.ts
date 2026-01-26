export const TREATMENTS_OBJ = [
  { key: 'signature', name: 'Signature Combination' },
  { key: 'microneedling', name: 'Microneedling Treatment' },
  { key: 'aquafacial', name: 'Aqua Treatment' },
  { key: 'ultimate', name: 'Ultimate Treatment' },
];

export const TREATMENTS = [
  'signature',
  'microneedling',
  'aquafacial',
  'ultimate',
] as const;

export type Treatment = (typeof TREATMENTS)[number];

export const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number];
