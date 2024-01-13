import {
  date,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

// Define custom types
export const genderEnum = pgEnum('gender', [
  'male',
  'female',
  'other',
  'prefer_not_to_say',
]);

// Define User table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  username: text('username').unique().notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  birthDate: date('birth_date', { mode: 'date' }).notNull(),
  gender: genderEnum('gender').default('prefer_not_to_say'),
  zipCode: text('zip_code').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Infer types from schema
export const User = users.$inferSelect;
