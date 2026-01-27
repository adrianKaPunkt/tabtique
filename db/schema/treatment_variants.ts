import { pgTable, uuid, text, boolean } from 'drizzle-orm/pg-core';

export const treatmentVariants = pgTable('treatment_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  label: text('label').notNull(),
  isActive: boolean('is_active').notNull().default(true),
});
