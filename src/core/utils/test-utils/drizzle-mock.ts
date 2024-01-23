import { sessions } from '@/core/database/schema/session';
import { users } from '@/core/database/schema/user';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import path from 'path';
import { Client } from 'pg';
import { ImportMock } from 'ts-mock-imports';

export const setupPostgresContainer = async () => {
  const POSTGRES_USER = 'postgres-test';
  const POSTGRES_PASSWORD = 'postgres-test';
  const POSTGRES_DB = 'postgres-test';

  const container = await new PostgreSqlContainer('pg_uuidv7')
    .withEnvironment({
      POSTGRES_USER,
      POSTGRES_PASSWORD,
      POSTGRES_DB,
    })
    .withExposedPorts(5432)
    .start();

  const CONNECTION_URI = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${container.getHost()}:${container.getFirstMappedPort()}/${POSTGRES_DB}`;

  const client = new Client({
    connectionString: CONNECTION_URI,
  });

  await client.connect();
  const db = drizzle(client, { schema: { users, sessions }, logger: true });

  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pg_uuidv7;`);

  const migrationPath = path.join(
    process.cwd(),
    'src/core/database/migrations',
  );

  await migrate(db, { migrationsFolder: migrationPath });

  const confirmDatabaseReady = await db.execute(sql`SELECT 1;`);

  return { container, db, confirmDatabaseReady, client };
};
