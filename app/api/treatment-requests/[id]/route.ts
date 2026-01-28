import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { AdminTreatmentSchema } from '@/lib/validation/admin-treatment';
import { db } from '@/db';
import { treatmentRequests } from '@/db/schema/treatment_requests';
import { treatmentRequestAddons } from '@/db/schema/treatment_request_addons';

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id: treatmentId } = await ctx.params;

  // 1) Body lesen
  const json = await req.json().catch(() => null);
  if (!json) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // 2) Validieren
  const result = AdminTreatmentSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        issues: result.error.flatten(), // fieldErrors + formErrors
      },
      { status: 400 },
    );
  }

  const data = result.data;

  // 3) Mapping Form -> DB
  const requestedAt = new Date(data.dateTime);

  try {
    await db.transaction(async (tx) => {
      // 4) Haupt-Record updaten
      // ⚠️ Spaltennamen hier ggf. anpassen (je nach deinem Drizzle schema)
      await tx
        .update(treatmentRequests)
        .set({
          requestedAt, // ggf. requestedAt vs requested_at
          treatmentOfferingId: data.treatmentOfferingId,
          priceSnapshotCents: data.priceCents,
          durationSnapshotMin: data.durationMin,
          status: data.status,

          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message ? data.message : null,

          userId: data.userId ?? null,
        })
        .where(eq(treatmentRequests.id, treatmentId));

      // 5) Addons komplett ersetzen
      await tx
        .delete(treatmentRequestAddons)
        .where(eq(treatmentRequestAddons.treatmentRequestId, treatmentId));

      if (data.addons.length > 0) {
        await tx.insert(treatmentRequestAddons).values(
          data.addons.map((a) => ({
            treatmentRequestId: treatmentId,

            // snapshots
            addonCodeSnapshot: a.addonCode,

            // ⚠️ In deinem Schema ist addon_label_snapshot NOT NULL.
            // Wenn du im Admin-Schema (noch) kein addonLabel hast,
            // nimm vorübergehend den Code als Label.
            addonLabelSnapshot: a.addonCode,

            isIncludedSnapshot: a.isIncluded,
            priceDeltaSnapshotCents: a.priceDeltaCents,
            durationDeltaSnapshotMin: a.durationDeltaMin,
          })),
        );
      }
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
