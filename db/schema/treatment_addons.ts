import { pgTable, uuid, text, boolean } from 'drizzle-orm/pg-core';

export const treatmentAddons = pgTable('treatment_addons', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  label: text('label').notNull(),
  isActive: boolean('is_active').notNull().default(true),
});
