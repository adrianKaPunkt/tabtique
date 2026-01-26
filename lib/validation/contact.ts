import { z } from 'zod';
import { TIME_SLOTS, TREATMENTS } from '../types';
import { getTodayISO, parseLocalDate } from '../date';

const TimeSlotsEnum = z.enum(TIME_SLOTS);
const TreatmentEnum = z.enum(TREATMENTS);

export const ContactSchema = z.object({
  date: z
    .string()
    .min(1, 'error.date.required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'error.date.invalid')
    .refine((val) => parseLocalDate(val) !== null, 'error.date.invalid')
    .refine((val) => {
      const today = getTodayISO('Europe/Berlin');
      return val >= today;
    }, 'error.date.past'),
  time: z
    .preprocess(
      (v) => (typeof v === 'string' && v.length ? v : undefined),
      TimeSlotsEnum.optional(),
    )
    .refine((v) => v !== undefined, { message: 'error.time.required' }),
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
