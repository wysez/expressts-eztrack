import { Pool } from 'pg';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';

import { env } from '@config';

import { users } from './schema/user';
import { budgetItems } from './schema/finances-budget-item';
import { DrizzleLogger } from './drizzle-logger';

let pool: Pool;
let db: NodePgDatabase<{
  users: typeof users;
  budgetItems: typeof budgetItems;
}>;

export const initializeDrizzleInstance = async () => {
  if (!db) {
    pool = new Pool({
      connectionString: env.POSTGRES_NPE_URL,
      ssl: env.POSTGRES_SSL,
    });

    db = drizzle(pool, {
      schema: { users, budgetItems },
      logger: new DrizzleLogger(),
    });
  }

  return db;
};

export const PostgresqlPool = () => {
  if (!pool) {
    throw new Error(
      'PostgreSQL pool not initialized. Call initializeDrizzleInstance() first.',
    );
  }

  return pool;
};

export const DrizzleInstance = () => {
  if (!db) {
    throw new Error(
      'Drizzle ORM instance not initialized. Call initializeDrizzleInstance() first.',
    );
  }

  return db;
};

export const closeDrizzleInstance = async () => {
  if (pool) {
    await pool.end();
  }
};
