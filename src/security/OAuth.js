import type {SecurityState} from "../reducers/SecurityReducer";
import {nowInSeconds} from "@openid/appauth";


export const needsToLogIn = (securityState: SecurityState) => {
  return !isAccessTokenValid(securityState);
};

export const canRefreshToken = (securityState: SecurityState) => {
  return !isAccessTokenValid(securityState);
};

export const needsToRefreshToken = (securityState: SecurityState) => {
  return true;
};

export const isAccessTokenValid = (securityState: SecurityState) => {
  return securityState && securityState.accessTokenInformation &&
    securityState.accessTokenInformation.expiresAt > nowInSeconds()
};