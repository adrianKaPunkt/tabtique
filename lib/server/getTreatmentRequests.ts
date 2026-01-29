import 'server-only';

import { db } from '@/db';
import { and, desc, eq, inArray } from 'drizzle-orm';

import { treatmentRequests } from '@/db/schema/treatment_requests';
import { treatmentTypes } from '@/db/schema/treatment_types';
import { treatmentVariants } from '@/db/schema/treatment_variants';
import { treatmentOfferings } from '@/db/schema/treatment_offerings';
import { treatmentRequestAddons } from '@/db/schema/treatment_request_addons';

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
    .$dynamic();

  if (conditions.length) query.where(and(...conditions));
  if (limit) query.limit(limit);

  query.orderBy(desc(treatmentRequests.createdAt));

  const rows = await query;

  // ---- Addons mitladen (2. Query) ----
  const ids = rows.map((r) => r.id);

  const addonRows =
    ids.length > 0
      ? await db
          .select({
            treatmentRequestId: treatmentRequestAddons.treatmentRequestId,
            addonCodeSnapshot: treatmentRequestAddons.addonCodeSnapshot,
            addonLabelSnapshot: treatmentRequestAddons.addonLabelSnapshot,
            isIncludedSnapshot: treatmentRequestAddons.isIncludedSnapshot,
            priceDeltaSnapshotCents:
              treatmentRequestAddons.priceDeltaSnapshotCents,
            durationDeltaSnapshotMin:
              treatmentRequestAddons.durationDeltaSnapshotMin,
          })
          .from(treatmentRequestAddons)
          .where(inArray(treatmentRequestAddons.treatmentRequestId, ids))
      : [];

  const addonsByRequest = new Map<
    string,
    Array<{
      addonCode: string;
      addonLabel: string;
      isIncluded: boolean;
      priceDeltaCents: number;
      durationDeltaMin: number;
    }>
  >();

  for (const a of addonRows) {
    const list = addonsByRequest.get(a.treatmentRequestId) ?? [];
    list.push({
      addonCode: a.addonCodeSnapshot,
      addonLabel: a.addonLabelSnapshot,
      isIncluded: a.isIncludedSnapshot,
      priceDeltaCents: a.priceDeltaSnapshotCents,
      durationDeltaMin: a.durationDeltaSnapshotMin,
    });
    addonsByRequest.set(a.treatmentRequestId, list);
  }

  return rows.map((r) => ({
    ...r,
    addons: addonsByRequest.get(r.id) ?? [],
  }));
}
