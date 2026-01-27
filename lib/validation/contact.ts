import { z } from 'zod';
import { TIME_SLOTS } from '@/lib/constants/timeSlots';

export const ContactSchema = z.object({
  date: z.string().min(1, 'error.date.required'),
  time: z.enum(TIME_SLOTS, { message: 'error.time.required' }),

  name: z.string().min(1, 'error.name.required').max(200),

  email: z
    .string()
    .min(1, 'error.email.required')
    .email('error.email.invalid')
    .max(320),

  phone: z
    .string()
    .min(1, 'error.phone.required')
    .max(50, 'error.phone.too-long')
    .refine(
      (v) => !v || /^[0-9+\-()\/\s]{6,50}$/.test(v),
      'error.phone.invalid',
    ),

  treatmentOfferingId: z
    .string()
    .min(1, 'error.treatment.required')
    .uuid('error.treatment.invalid'),

  message: z.string().max(5000).optional().or(z.literal('')),
});

export type ContactFormValues = z.infer<typeof ContactSchema>;

/**
 * 'Validate a single contact form field
 */
export function validateContactField<K extends keyof ContactFormValues>(
  field: K,
  value: unknown,
): string | undefined {
  const fieldSchema = ContactSchema.shape[field];
  const result = fieldSchema.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

// import { z } from 'zod';
// import {
//   TREATMENTS,
//   TREATMENT_VARIANTS,
//   VARIANTS_BY_TREATMENT,
//   type Treatment,
//   type TreatmentVariant,
// } from '@/lib/constants/treatments';
// import { TIME_SLOTS } from '@/lib/constants/timeSlots';

// export const ContactSchema = z
//   .object({
//     date: z.string().min(1, 'error.date.required'),
//     time: z.enum(TIME_SLOTS, 'error.time.required'),
//     name: z.string().min(1, 'error.name.required').max(200),
//     email: z
//       .string()
//       .min(1, 'error.email.required')
//       .email('error.email.invalid')
//       .max(320),
//     phone: z
//       .string()
//       .min(1, 'error.phone.required')
//       .max(50, 'error.phone.too-long')
//       .refine(
//         (v) => !v || /^[0-9+\-()\/\s]{6,50}$/.test(v),
//         'error.phone.invalid',
//       ),

//     treatment: z.enum(TREATMENTS, 'error.treatment.required'),
//     treatmentVariant: z.enum(
//       TREATMENT_VARIANTS,
//       'error.treatmentVariant.required',
//     ),

//     message: z.string().max(5000).optional().or(z.literal('')),
//   })
//   .superRefine((data, ctx) => {
//     const allowed = VARIANTS_BY_TREATMENT[
//       data.treatment as Treatment
//     ] as readonly TreatmentVariant[];

//     if (!allowed.includes(data.treatmentVariant as TreatmentVariant)) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         path: ['treatmentVariant'],
//         message:
//           'Diese Variante ist für die gewählte Behandlung nicht verfügbar.',
//       });
//     }
//   });

// export type ContactFormValues = z.infer<typeof ContactSchema>;

// /**
//  * 'Validate a single contact form field
//  * @param field
//  * @param value
//  * @returns
//  */
// export function validateContactField<K extends keyof ContactFormValues>(
//   field: K,
//   value: unknown,
// ): string | undefined {
//   const fieldSchema = ContactSchema.shape[field];
//   const result = fieldSchema.safeParse(value);
//   return result.success ? undefined : result.error.issues[0]?.message;
// }
