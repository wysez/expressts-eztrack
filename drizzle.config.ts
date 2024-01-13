import { defineConfig } from 'drizzle-kit';
import { env } from './src/core/config';

export default defineConfig({
  schema: './src/core/schema/*',
  out: 'drizzle',
  driver: 'pg',
  dbCredentials: {
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DATABASE,
  },
  verbose: true,
  strict: true,
});
