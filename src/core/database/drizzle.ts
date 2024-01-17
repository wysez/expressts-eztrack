import { Client } from 'pg';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';

import { env } from '@config';

import { users } from './schema/user';
import { sessions } from './schema/session';

let db: NodePgDatabase<{ users: typeof users; sessions: typeof sessions }>;

export const initializeDrizzleInstance = async () => {
  if (!db) {
    const client = new Client({
      connectionString: env.POSTGRES_NPE_URL,
      ssl: env.POSTGRES_SSL,
    });

    await client.connect();
    db = drizzle(client, { schema: { users, sessions }, logger: true });
  }

  return db;
};

export const DrizzleInstance = () => {
  if (!db) {
    throw new Error(
      'Drizzle ORM instance not initialized. Call initializeDrizzle() first.',
    );
  }

  return db;
};
