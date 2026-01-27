import { db } from '@/db';
import { treatmentOfferings } from '@/db/schema/treatment_offerings';
import { treatmentTypes } from '@/db/schema/treatment_types';
import { treatmentVariants } from '@/db/schema/treatment_variants';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
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

        isActive: treatmentOfferings.isActive,
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

    return NextResponse.json(
      { offerings: rows },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      },
    );
  } catch (error) {
    console.error('GET /api/treatment-offerings error:', error);
    return NextResponse.json(
      { error: 'Failed to load treatment offerings' },
      { status: 500 },
    );
  }
}
