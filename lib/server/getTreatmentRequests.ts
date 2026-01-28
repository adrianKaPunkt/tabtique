import 'server-only';

import { db } from '@/db';
import { and, desc, eq } from 'drizzle-orm';
import { treatmentRequests } from '@/db/schema/treatment_requests';
import { treatmentTypes } from '@/db/schema/treatment_types';
import { treatmentVariants } from '@/db/schema/treatment_variants';
import { treatmentOfferings } from '@/db/schema/treatment_offerings';

type GetTreatmentRequestsOptions = {
  status?: string;
  limit?: number;
};

export async function getTreatmentRequests(
  options: GetTreatmentRequestsOptions = {},
) {
  const { status, limit } = options;

  const conditions = [];
  if (status) conditions.push(eq(treatmentRequests.status, status));

  const query = db
    .select({
      id: treatmentRequests.id,
      createdAt: treatmentRequests.createdAt,
      status: treatmentRequests.status,

      name: treatmentRequests.name,
      email: treatmentRequests.email,
      phone: treatmentRequests.phone,
      message: treatmentRequests.message,
      requestedAt: treatmentRequests.requestedAt,

      priceSnapshotCents: treatmentRequests.priceSnapshotCents,
      durationSnapshotMin: treatmentRequests.durationSnapshotMin,

      treatmentOfferingId: treatmentRequests.treatmentOfferingId,
      treatmentType: treatmentTypes.label,
      variant: treatmentVariants.label,
    })
    .from(treatmentRequests)
    .innerJoin(
      treatmentOfferings,
      eq(treatmentOfferings.id, treatmentRequests.treatmentOfferingId),
    )
    .innerJoin(
      treatmentTypes,
      eq(treatmentTypes.id, treatmentOfferings.treatmentTypeId),
    )
    .innerJoin(
      treatmentVariants,
      eq(treatmentVariants.id, treatmentOfferings.treatmentVariantId),
    )
    .$dynamic(); // <-- wichtig für optionales .where/.limit usw.

  if (conditions.length) query.where(and(...conditions));
  if (limit) query.limit(limit);

  query.orderBy(desc(treatmentRequests.createdAt));

  return await query;
}
