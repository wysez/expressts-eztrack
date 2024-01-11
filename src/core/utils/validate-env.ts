import { bool, cleanEnv, port, str } from 'envalid';
import { url } from 'inspector';

export const validateEnv = () => {
  cleanEnv(process.env, {
    // General configuration
    NODE_ENV: str(),
    PORT: port(),
    SESSION_SECRET: str(),
    LOG_FORMAT: str(),
    LOG_DIR: str(),
    ORIGIN: str(),
    CREDENTIALS: bool(),

    // PostgreSQL configuration
    POSTGRES_USER: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_HOST: str(),
    POSTGRES_PORT: port(),
    POSTGRES_DATABASE: str(),

    // OIDC configuration
    OIDC_ISSUER: url(),
    OIDC_CLIENT_ID: str(),
    OIDC_CLIENT_SECRET: str(),
    OIDC_REDIRECT_URI: url(),
    OIDC_SCOPE: str(),
    OIDC_RESPONSE_TYPE: str(),
    OIDC_RESPONSE_MODE: str(),
    OIDC_GRANT_TYPE: str(),
    OIDC_USE_PKCE: bool(),
  });
};
