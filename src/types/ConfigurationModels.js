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
