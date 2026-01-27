import { treatmentTypes } from './treatment_types';
import { treatmentVariants } from './treatment_variants';
import { pgTable, uuid, integer, boolean, unique } from 'drizzle-orm/pg-core';

export const treatmentOfferings = pgTable(
  'treatment_offerings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    treatmentTypeId: uuid('treatment_type_id')
      .notNull()
      .references(() => treatmentTypes.id),
    treatmentVariantId: uuid('treatment_variant_id')
      .notNull()
      .references(() => treatmentVariants.id),
    priceCents: integer('price_cents').notNull(),
    durationMin: integer('duration_min').notNull(),
    isActive: boolean('is_active').notNull().default(true),
  },
  (table) => ({
    uniqueOffering: unique().on(
      table.treatmentTypeId,
      table.treatmentVariantId,
    ),
  }),
);
