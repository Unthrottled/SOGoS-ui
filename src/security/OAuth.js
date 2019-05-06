import type {SecurityState} from "../reducers/SecurityReducer";
import {nowInSeconds} from "@openid/appauth";


export const shouldCheckForAuthorizationGrant = (securityState: SecurityState) => {
  return !isAccessTokenValid(securityState);
};

export const canRefreshToken = (securityState: SecurityState) => {
  return !isAccessTokenValid(securityState) && securityState && securityState.refreshToken;
};

export const isAccessTokenValid = (securityState: SecurityState) => {
  return securityState && securityState.accessTokenInformation &&
    securityState.accessTokenInformation.expiresAt > nowInSeconds()
};
