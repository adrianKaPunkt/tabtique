import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const contactRequestStatus = pgEnum('contact_request_status', [
  'new',
  'read',
  'pending',
  'accepted',
  'denied',
  'archived',
]);

export const treatmentType = pgEnum('treatment_type', [
  'signature',
  'microneedling',
  'aquafacial',
  'ultimate',
]);

export const treatmentVariant = pgEnum('treatment_variant', [
  'basic',
  'cica_aqua_exo',
  'salmon_dna',
  'pdx_exosomes',
]);

export const treatmentRequests = pgTable(
  'treatment_requests',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    name: varchar('name', { length: 50 }).notNull(),
    email: varchar('email', { length: 60 }).notNull(),
    treatment: treatmentType('treatment').notNull(),
    variant: treatmentVariant('variant').default('basic').notNull(),
    status: contactRequestStatus('status').default('new').notNull(),
    requestedAt: timestamp('requested_at', { withTimezone: true }).notNull(),
    message: text('message'),
    userId: uuid('user_id'),
  },
  (t) => ({
    statusIdx: index('treatment_requests_status_idx').on(t.status),
    requestedAtIdx: index('treatment_requests_requested_at_idx').on(
      t.requestedAt,
    ),
  }),
);

export type TreatmentRequest = typeof treatmentRequests.$inferSelect;
export type NewTreatmentRequest = typeof treatmentRequests.$inferInsert;
