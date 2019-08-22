export type OAuthConfig = {
  authorizationEndpoint: string,
  endSessionEndpoint: string,
  revocationEndpoint: string,
  tokenEndpoint: string,
  userInfoEndpoint: string,
}
export type InitialConfig = {
  callbackURI: string,
  clientID: string,
  openIDConnectURI: string,
  provider: string,
}
export type MiscellaneousConfig = {
  notificationsAllowed: string,
}

export const NOT_ASKED = 'NOT_ASKED';
