import { pgTable, boolean, text, uuid } from 'drizzle-orm/pg-core';

export const treatmentTypes = pgTable('treatment_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  label: text('label').notNull(),
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
});
