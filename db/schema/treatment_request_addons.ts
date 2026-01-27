import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  unique,
  index,
} from 'drizzle-orm/pg-core';
import { treatmentRequests } from './treatment_requests';

export const treatmentRequestAddons = pgTable(
  'treatment_request_addons',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    treatmentRequestId: uuid('treatment_request_id')
      .notNull()
      .references(() => treatmentRequests.id, { onDelete: 'cascade' }),

    // snapshot fields (stable even if addons change later)
    addonCodeSnapshot: text('addon_code_snapshot').notNull(),
    addonLabelSnapshot: text('addon_label_snapshot').notNull(),

    isIncludedSnapshot: boolean('is_included_snapshot').notNull(),

    priceDeltaSnapshotCents: integer('price_delta_snapshot_cents')
      .notNull()
      .default(0),

    durationDeltaSnapshotMin: integer('duration_delta_snapshot_min')
      .notNull()
      .default(0),
  },
  (t) => ({
    uniqRequestAddon: unique().on(t.treatmentRequestId, t.addonCodeSnapshot),
    idxRequestId: index('idx_treatment_request_addons_request_id').on(
      t.treatmentRequestId,
    ),
    // optional, but nice for analytics
    idxAddonCode: index('idx_treatment_request_addons_code').on(
      t.addonCodeSnapshot,
    ),
  }),
);
