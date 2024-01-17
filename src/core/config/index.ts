import { config } from 'dotenv';
import { bool, cleanEnv, port, str, url } from 'envalid';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const env = cleanEnv(process.env, {
  // General configuration
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  PORT: port({ devDefault: 5174 }),
  SESSION_SECRET: str(),
  LOG_FORMAT: str({ choices: ['combined', 'dev', 'simple'] }),
  LOG_DIR: str({ devDefault: '../../../logs' }),
  ORIGIN: url({ devDefault: 'http://localhost:3000' }),
  CREDENTIALS: bool({ default: true }),

  // PostgreSQL configuration
  POSTGRES_ADMIN_URL: url(),
  POSTGRES_NPE_URL: url(),
  POSTGRES_SSL: bool(),

  // OIDC configuration
  OIDC_ISSUER: url(),
  OIDC_CLIENT_ID: str(),
  OIDC_CLIENT_SECRET: str(),
  OIDC_REDIRECT_URI: url({ devDefault: 'http://localhost:3000' }),
  OIDC_SCOPE: str({ default: 'code' }),
  OIDC_RESPONSE_TYPE: str({ default: 'openid profile' }),
  OIDC_RESPONSE_MODE: str(),
  OIDC_GRANT_TYPE: str(),
  OIDC_USE_PKCE: bool({ default: true }),
});
