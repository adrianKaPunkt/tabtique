import { pgTable, text } from 'drizzle-orm/pg-core';

export const treatmentStatus = pgTable('treatment_status', {
  key: text('key').primaryKey(),
  labelDe: text('label_de').notNull(),
  labelEn: text('label_en').notNull(),
  color: text('color').notNull(),
  sortOrder: text('sort_order').notNull(),
});
