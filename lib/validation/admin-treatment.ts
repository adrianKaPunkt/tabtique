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
    .min(1, 'Datum und Uhrzeit sind erforderlich')
    .refine(
      (v) => !Number.isNaN(new Date(v).getTime()),
      'Datum und Uhrzeit sind ungültig',
    ),

  // 2️⃣ Behandlung
  treatmentOfferingId: z.string().uuid('Behandlung ist ungültig'),
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
  priceCents: z.number().int().min(0, 'Preis ist ungültig'),

  durationMin: z.number().int().min(1, 'Dauer ist ungültig'),

  // 5️⃣ Status
  status: z.enum(TREATMENT_STATUS),

  // 6️⃣ Kundendaten
  name: z.string().min(1, 'Name ist erforderlich').max(200),

  email: z
    .string()
    .min(1, 'E-Mail ist erforderlich')
    .email('E-Mail ist ungültig')
    .max(320),

  phone: z
    .string()
    .min(1, 'Telefonnummer ist erforderlich')
    .max(50)
    .refine(
      (v) => /^[0-9+\-()\/\s]{6,50}$/.test(v),
      'Telefonnummer ist ungültig',
    ),

  message: z.string().max(5000).optional().or(z.literal('')),

  // 7️⃣ Optionale Verknüpfung
  userId: z.string().uuid().optional(),
});

export type AdminTreatmentFormValues = z.infer<typeof AdminTreatmentSchema>;
