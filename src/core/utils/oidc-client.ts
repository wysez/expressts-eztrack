import { Client, Issuer } from 'openid-client';
import { env } from '@config';

let oidc: Client | null = null;

export const initializeOpenIDConnectClient = async () => {
  const issuer = await Issuer.discover(env.OIDC_ISSUER);
  oidc = new issuer.Client({
    client_id: env.OIDC_CLIENT_ID,
    client_secret: env.OIDC_CLIENT_SECRET,
    redirect_uris: [env.OIDC_REDIRECT_URI],
    response_types: [env.OIDC_RESPONSE_TYPE],
    token_endpoint_auth_method: 'client_secret_basic',
  });
};

export const OpenIDClient = () => {
  if (!oidc) {
    throw new Error('OpenID Issuer not initialized.');
  }

  return oidc;
};
