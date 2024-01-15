import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const sessions = pgTable('session', {
  id: serial('id').primaryKey().notNull(),
  session_id: text('session_id').notNull(),
  data: text('data').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
