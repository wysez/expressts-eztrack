import { Client, Issuer } from 'openid-client';
import {
  OIDC_CLIENT_ID,
  OIDC_CLIENT_SECRET,
  OIDC_ISSUER,
  OIDC_REDIRECT_URI,
  OIDC_RESPONSE_TYPE,
} from '../config';

let oidc: Client | null = null;

export const initializeOpenIDConnectClient = async () => {
  const issuer = await Issuer.discover(OIDC_ISSUER);
  oidc = new issuer.Client({
    client_id: OIDC_CLIENT_ID,
    client_secret: OIDC_CLIENT_SECRET,
    redirect_uris: [OIDC_REDIRECT_URI],
    response_types: [OIDC_RESPONSE_TYPE],
    token_endpoint_auth_method: 'client_secret_basic',
  });
};

export const OpenIDClient = () => {
  if (!oidc) {
    throw new Error('OpenID Issuer not initialized.');
  }

  return oidc;
};
