import { z } from 'zod';
import {
  TREATMENTS,
  TREATMENT_VARIANTS,
  VARIANTS_BY_TREATMENT,
  type Treatment,
  type TreatmentVariant,
} from '@/lib/constants/treatments';
import { TIME_SLOTS } from '@/lib/constants/timeSlots';

// Zod enums aus deinen "as const" Arrays
const TreatmentSchema = z.enum(TREATMENTS);
const TreatmentVariantSchema = z.enum(TREATMENT_VARIANTS);
const TimeSlotSchema = z.enum(TIME_SLOTS);

export const ContactSchema = z
  .object({
    name: z.string().min(2).max(200),
    email: z.string().email().max(320),
    phone: z.string().min(3).max(50).optional().or(z.literal('')),
    date: z.string(), // falls du später willst: z.coerce.date() etc.
    time: TimeSlotSchema,

    treatment: TreatmentSchema,
    treatmentVariant: TreatmentVariantSchema.default('basic'),

    message: z.string().max(5000).optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    const allowed = VARIANTS_BY_TREATMENT[
      data.treatment as Treatment
    ] as readonly TreatmentVariant[];

    if (!allowed.includes(data.treatmentVariant)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['treatmentVariant'],
        message:
          'Diese Variante ist für die gewählte Behandlung nicht verfügbar.',
      });
    }
  });

export type ContactFormValues = z.infer<typeof ContactSchema>;

/**
 * 'Validate a single contact form field
 * @param field
 * @param value
 * @returns
 */
export function validateContactField<K extends keyof ContactFormValues>(
  field: K,
  value: unknown,
): string | undefined {
  const fieldSchema = ContactSchema.shape[field];
  const result = fieldSchema.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}
