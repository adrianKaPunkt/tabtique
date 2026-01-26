import {
  pgEnum,
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
} from 'drizzle-orm/pg-core';
import {
  TREATMENTS,
  TREATMENT_VARIANTS,
  REQUEST_STATUSES,
} from '@/lib/constants/treatments';

export const treatmentType = pgEnum('treatment_type', [...TREATMENTS]);
export const treatmentVariant = pgEnum('treatment_variant', [
  ...TREATMENT_VARIANTS,
]);
export const contactRequestStatus = pgEnum('contact_request_status', [
  ...REQUEST_STATUSES,
]);

export const treatmentRequests = pgTable('treatment_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  name: varchar('name', { length: 200 }).notNull(),
  email: varchar('email', { length: 320 }).notNull(),

  treatment: treatmentType('treatment').notNull(),
  treatmentVariant: treatmentVariant('treatment_variant')
    .default('basic')
    .notNull(),

  status: contactRequestStatus('status').default('new').notNull(),

  requestedAt: timestamp('requested_at', { withTimezone: true }),
  message: text('message'),
  userId: uuid('user_id'),
});
