import { relations } from 'drizzle-orm';
import { numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './user';

export const budgetItems = pgTable('budget_items', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  title: text('budget_item_title').notNull(),
  amount: numeric('budget_item_amount').notNull(),
  category: text('budget_item_category').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const budgetItemsRelations = relations(budgetItems, ({ one }) => ({
  user: one(users, {
    fields: [budgetItems.userId],
    references: [users.id],
  }),
}));

export type SelectBudgetItem = typeof budgetItems.$inferSelect;
export type InsertBudgetItem = typeof budgetItems.$inferInsert;
