import { z } from 'zod';
import { TREATMENT_STATUS } from '@/lib/constants/treatments';

/**
 * Admin schema: full editable treatment state
 * ID comes from URL, NOT from schema
 */
export const AdminTreatmentSchema = z.object({
  // 1️⃣ Termin
  dateTime: z
    .string()
    .min(1, 'error.datetime.required')
    .refine(
      (v) => !Number.isNaN(new Date(v).getTime()),
      'error.datetime.invalid',
    ),

  // 2️⃣ Behandlung
  treatmentOfferingId: z.string().uuid('error.treatment.invalid'),

  // 3️⃣ Addons (komplette Liste ersetzen)
  addons: z
    .array(
      z.object({
        addonCode: z.string().min(1),
        isIncluded: z.boolean(),
        priceDeltaCents: z.number().int(),
        durationDeltaMin: z.number().int(),
      }),
    )
    .default([]),

  // 4️⃣ Preis & Dauer
  priceCents: z.number().int().min(0, 'error.price.invalid'),

  durationMin: z.number().int().min(1, 'error.duration.invalid'),

  // 5️⃣ Status
  status: z.enum(TREATMENT_STATUS),

  // 6️⃣ Kundendaten
  name: z.string().min(1, 'error.name.required').max(200),

  email: z.string().email('error.email.invalid').max(320),

  phone: z
    .string()
    .min(1, 'error.phone.required')
    .max(50)
    .refine((v) => /^[0-9+\-()\/\s]{6,50}$/.test(v), 'error.phone.invalid'),

  message: z.string().max(5000).optional().or(z.literal('')),

  // 7️⃣ Optionale Verknüpfung
  userId: z.string().uuid().optional(),
});

export type AdminTreatmentFormValues = z.infer<typeof AdminTreatmentSchema>;
