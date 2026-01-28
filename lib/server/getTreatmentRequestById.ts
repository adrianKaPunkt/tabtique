import 'server-only';

import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { treatmentRequests } from '@/db/schema/treatment_requests';
import { treatmentRequestAddons } from '@/db/schema/treatment_request_addons';

export async function getTreatmentRequestById(id: string) {
  const [request] = await db
    .select()
    .from(treatmentRequests)
    .where(eq(treatmentRequests.id, id));

  if (!request) return null;

  const addons = await db
    .select()
    .from(treatmentRequestAddons)
    .where(eq(treatmentRequestAddons.treatmentRequestId, id));

  return { ...request, addons };
}
