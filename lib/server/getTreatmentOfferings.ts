import { and, eq } from 'drizzle-orm';
import { db } from '@/db';

import { treatmentOfferings } from '@/db/schema/treatment_offerings';
import { treatmentTypes } from '@/db/schema/treatment_types';
import { treatmentVariants } from '@/db/schema/treatment_variants';

export type TreatmentOfferingDTO = {
  offeringId: string;

  treatmentTypeId: string;
  treatmentCode: string;
  treatmentLabel: string;

  variantId: string;
  variantCode: string;
  variantLabel: string;

  priceCents: number;
  durationMin: number;
};

export async function getTreatmentOfferings(): Promise<TreatmentOfferingDTO[]> {
  const rows = await db
    .select({
      offeringId: treatmentOfferings.id,

      treatmentTypeId: treatmentTypes.id,
      treatmentCode: treatmentTypes.code,
      treatmentLabel: treatmentTypes.label,

      variantId: treatmentVariants.id,
      variantCode: treatmentVariants.code,
      variantLabel: treatmentVariants.label,

      priceCents: treatmentOfferings.priceCents,
      durationMin: treatmentOfferings.durationMin,
    })
    .from(treatmentOfferings)
    .innerJoin(
      treatmentTypes,
      eq(treatmentOfferings.treatmentTypeId, treatmentTypes.id),
    )
    .innerJoin(
      treatmentVariants,
      eq(treatmentOfferings.treatmentVariantId, treatmentVariants.id),
    )
    .where(
      and(
        eq(treatmentOfferings.isActive, true),
        eq(treatmentTypes.isActive, true),
        eq(treatmentVariants.isActive, true),
      ),
    )
    .orderBy(treatmentTypes.code, treatmentVariants.code);

  return rows;
}
