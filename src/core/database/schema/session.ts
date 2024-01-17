import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const sessions = pgTable('session', {
  id: serial('id').primaryKey().notNull(),
  session_id: text('session_id').notNull(),
  expiresAt: integer('expires_at').notNull(),
  data: text('data').notNull(),
});

export type Session = typeof sessions.$inferSelect;
