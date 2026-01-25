import { z } from 'zod';

// Keys als Tuple (TS-sicher für z.enum)
export const TREATMENT_KEYS = [
  'signature',
  'microneedling',
  'aquafacial',
  'ultimate',
] as const;

export type TreatmentKey = (typeof TREATMENT_KEYS)[number];

export const TREATMENTS = [
  { key: 'signature', name: 'Signature Treatment' },
  { key: 'microneedling', name: 'Microneedling' },
  { key: 'aquafacial', name: 'Aquafacial' },
  { key: 'ultimate', name: 'Ultimate Treatment' },
] as const;

const TreatmentEnum = z.enum(TREATMENT_KEYS);

export const ContactSchema = z.object({
  date: z
    .string()
    .min(1, 'error.date.required')
    .refine((val) => !isNaN(Date.parse(val)), 'error.date.invalid'),
  name: z.string().min(1, 'error.name.required').max(30, 'error.name.too-long'),
  email: z
    .string()
    .trim()
    .min(1, 'error.email.required')
    .max(50, 'error.email.too-long')
    .email('error.email.invalid'),
  phone: z
    .string()
    .min(6, 'error.phone.required')
    .max(20, 'error.phone.too-long')
    .regex(/^[0-9+()\/\s-]+$/, 'error.phone.invalid'),
  message: z
    .string()
    .max(1000, 'error.message.too-long')
    .optional()
    .or(z.literal('')),

  // required + enum valid
  treatment: z
    .preprocess(
      (v) => (typeof v === 'string' ? v : undefined),
      TreatmentEnum.optional(),
    )
    .refine((v) => v !== undefined, { message: 'error.treatment.required' }),
});

export type ContactFormValues = z.infer<typeof ContactSchema>;

export function validateContactField<K extends keyof ContactFormValues>(
  field: K,
  value: unknown,
): string | undefined {
  const fieldSchema = ContactSchema.shape[field];
  const result = fieldSchema.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}
