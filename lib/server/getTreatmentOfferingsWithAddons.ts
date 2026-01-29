import { and, eq } from 'drizzle-orm';
import { db } from '@/db';

import { treatmentOfferings } from '@/db/schema/treatment_offerings';
import { treatmentTypes } from '@/db/schema/treatment_types';
import { treatmentVariants } from '@/db/schema/treatment_variants';
import { treatmentOfferingAddons } from '@/db/schema/treatment_offering_addons';
import { treatmentAddons } from '@/db/schema/treatment_addons';

export type OfferingAddonDTO = {
  addonId: string;
  addonCode: string;
  addonLabel: string;
  isIncluded: boolean;
  isOptional: boolean;
  priceDeltaCents: number;
  durationDeltaMin: number;
};

export type TreatmentOfferingDTO = {
  offeringId: string;
  treatmentCode: string;
  treatmentLabel: string;
  variantCode: string;
  variantLabel: string;
  priceCents: number;
  durationMin: number;
  addons: OfferingAddonDTO[];
};

export async function getTreatmentOfferingsWithAddons(): Promise<
  TreatmentOfferingDTO[]
> {
  const rows = await db
    .select({
      offeringId: treatmentOfferings.id,
      offeringIsActive: treatmentOfferings.isActive,
      priceCents: treatmentOfferings.priceCents,
      durationMin: treatmentOfferings.durationMin,

      treatmentIsActive: treatmentTypes.isActive,
      treatmentCode: treatmentTypes.code,
      treatmentLabel: treatmentTypes.label,

      variantIsActive: treatmentVariants.isActive,
      variantCode: treatmentVariants.code,
      variantLabel: treatmentVariants.label,

      addonId: treatmentAddons.id,
      addonIsActive: treatmentAddons.isActive,
      addonCode: treatmentAddons.code,
      addonLabel: treatmentAddons.label,

      isIncluded: treatmentOfferingAddons.isIncluded,
      isOptional: treatmentOfferingAddons.isOptional,
      priceDeltaCents: treatmentOfferingAddons.priceDeltaCents,
      durationDeltaMin: treatmentOfferingAddons.durationDeltaMin,
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
    // offering_addons is optional in general, but in your setup we seeded dermaplaning for all offerings.
    // To be safe, we use LEFT JOIN so it still works if an offering has zero addons later.
    .leftJoin(
      treatmentOfferingAddons,
      eq(treatmentOfferingAddons.treatmentOfferingId, treatmentOfferings.id),
    )
    .leftJoin(
      treatmentAddons,
      eq(treatmentAddons.id, treatmentOfferingAddons.treatmentAddonId),
    )
    .where(
      and(
        eq(treatmentOfferings.isActive, true),
        eq(treatmentTypes.isActive, true),
        eq(treatmentVariants.isActive, true),
      ),
    );

  // Group rows → one offering with addons[]
  const map = new Map<string, TreatmentOfferingDTO>();

  for (const r of rows) {
    const key = r.offeringId;

    if (!map.has(key)) {
      map.set(key, {
        offeringId: r.offeringId,
        treatmentCode: r.treatmentCode,
        treatmentLabel: r.treatmentLabel,
        variantCode: r.variantCode,
        variantLabel: r.variantLabel,
        priceCents: r.priceCents,
        durationMin: r.durationMin,
        addons: [],
      });
    }

    // addon may be null because of LEFT JOIN
    if (r.addonId && r.addonCode && r.addonLabel) {
      // optional: filter inactive addons
      if (r.addonIsActive === false) continue;

      map.get(key)!.addons.push({
        addonId: r.addonId,
        addonCode: r.addonCode,
        addonLabel: r.addonLabel,
        isIncluded: r.isIncluded ?? false,
        isOptional: r.isOptional ?? true,
        priceDeltaCents: r.priceDeltaCents ?? 0,
        durationDeltaMin: r.durationDeltaMin ?? 0,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    const t = a.treatmentCode.localeCompare(b.treatmentCode);
    if (t !== 0) return t;
    return a.variantCode.localeCompare(b.variantCode);
  });
}
