import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';
import { env } from '../src/core/config';

(async () => {
  console.log('❕ Starting migration...');
  const client = new Client({
    connectionString: env.POSTGRES_ADMIN_URL,
  });

  await client.connect();

  console.log('❕ Connected to database.');

  const db = drizzle(client);

  console.log('❕ Drizzle instance initialized.');

  console.log('❕ Migrating database...');

  await migrate(db, { migrationsFolder: 'drizzle' });

  console.log('❕ Database migrated.');

  console.log('❕ Closing database connection...');
  await client.end();

  console.log('❕ Database connection closed.');

  console.log('✅ Migration complete.');
})().catch(error => {
  console.error(error);
  console.log('❌ Migration failed.');
  process.exit(1);
});
