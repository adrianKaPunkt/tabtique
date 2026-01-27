import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { treatmentOfferings } from './treatment_offerings';

export const treatmentRequests = pgTable('treatment_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  message: text('message'),
  requestedAt: timestamp('requested_at', { withTimezone: true }).notNull(),
  treatmentOfferingId: uuid('treatment_offering_id')
    .notNull()
    .references(() => treatmentOfferings.id),
  priceSnapshotCents: integer('price_snapshot_cents').notNull(),
  durationSnapshotMin: integer('duration_snapshot_min').notNull(),
  status: text('status').notNull().default('new'),
  userId: text('user_id'),
});
