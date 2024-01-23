import { relations } from 'drizzle-orm';
import {
  date,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { budgetItems } from './finances-budget-item';

// Define custom types
export const genderEnum = pgEnum('gender', [
  'male',
  'female',
  'other',
  'prefer_not_to_say',
]);

// Define User table
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    username: text('username').unique().notNull(),
    email: text('email').unique().notNull(),
    password: text('password').notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    birthDate: date('birth_date', { mode: 'string' }).notNull(),
    gender: genderEnum('gender').default('prefer_not_to_say'),
    zipCode: text('zip_code').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  table => ({
    username_idx: index('username_idx').on(table.username),
  }),
);

export const userRelations = relations(users, ({ many }) => ({
  budgetItems: many(budgetItems),
}));

// Infer types from schema
export const SelectUser = users.$inferSelect;
export const InsertUser = users.$inferInsert;
