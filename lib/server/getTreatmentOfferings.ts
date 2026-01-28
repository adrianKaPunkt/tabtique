import 'server-only';

import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { treatmentOfferings } from '@/db/schema/treatment_offerings';
import { treatmentTypes } from '@/db/schema/treatment_types';
import { treatmentVariants } from '@/db/schema/treatment_variants';

export type TreatmentOfferingOption = {
  id: string;
  label: string; // z.B. "Signature Combination – Salmon DNA"
  priceCents: number;
  durationMin: number;
};

export async function getTreatmentOfferings(): Promise<
  TreatmentOfferingOption[]
> {
  const rows = await db
    .select({
      id: treatmentOfferings.id,
      typeLabel: treatmentTypes.label,
      variantLabel: treatmentVariants.label,
      priceCents: treatmentOfferings.priceCents,
      durationMin: treatmentOfferings.durationMin,
    })
    .from(treatmentOfferings)
    .innerJoin(
      treatmentTypes,
      eq(treatmentTypes.id, treatmentOfferings.treatmentTypeId),
    )
    .innerJoin(
      treatmentVariants,
      eq(treatmentVariants.id, treatmentOfferings.treatmentVariantId),
    );

  return rows.map((r) => ({
    id: r.id,
    label: `${r.typeLabel} – ${r.variantLabel}`,
    priceCents: r.priceCents,
    durationMin: r.durationMin,
  }));
}
