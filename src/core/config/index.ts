import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SESSION_SECRET, LOG_FORMAT, LOG_DIR, ORIGIN } =
  process.env;
export const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DATABASE,
} = process.env;
export const {
  OIDC_ISSUER,
  OIDC_CLIENT_ID,
  OIDC_CLIENT_SECRET,
  OIDC_REDIRECT_URI,
  OIDC_SCOPE,
  OIDC_RESPONSE_TYPE,
  OIDC_RESPONSE_MODE,
  OIDC_GRANT_TYPE,
  OIDC_USE_PKCE,
} = process.env;
