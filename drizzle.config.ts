import { defineConfig } from 'drizzle-kit';
import { env } from './src/core/config';

export default defineConfig({
  schema: './src/core/database/schema/*',
  out: 'drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: env.POSTGRES_ADMIN_URL,
  },
  verbose: true,
  strict: true,
});
