import { Client } from 'pg';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';

import { users } from './schema/user';
import { env } from '../config';

let db: NodePgDatabase<{ users: typeof users }>;

export const initializeDrizzleInstance = async () => {
  if (!db) {
    const client = new Client({
      host: env.POSTGRES_HOST,
      port: env.POSTGRES_PORT,
      user: env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD,
      database: env.POSTGRES_DATABASE,
      ssl: env.POSTGRES_SSL,
    });

    await client.connect();
    db = drizzle(client, { schema: { users } });
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
