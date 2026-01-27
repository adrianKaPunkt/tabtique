import { pgTable, uuid, boolean, integer, unique } from 'drizzle-orm/pg-core';
import { treatmentOfferings } from './treatment_offerings';
import { treatmentAddons } from './treatment_addons';

export const treatmentOfferingAddons = pgTable(
  'treatment_offering_addons',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    treatmentOfferingId: uuid('treatment_offering_id')
      .notNull()
      .references(() => treatmentOfferings.id, { onDelete: 'restrict' }),

    treatmentAddonId: uuid('treatment_addon_id')
      .notNull()
      .references(() => treatmentAddons.id, { onDelete: 'restrict' }),

    isIncluded: boolean('is_included').notNull().default(false),
    isOptional: boolean('is_optional').notNull().default(true),

    priceDeltaCents: integer('price_delta_cents').notNull().default(0),
    durationDeltaMin: integer('duration_delta_min').notNull().default(0),
  },
  (t) => ({
    uniqOfferingAddon: unique().on(t.treatmentOfferingId, t.treatmentAddonId),
  }),
);
