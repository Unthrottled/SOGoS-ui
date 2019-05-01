import type {SecurityState} from "../reducers/SecurityReducer";
import {nowInSeconds} from "@openid/appauth";


export const needsToLogIn = (securityState: SecurityState) => {
  return !areCredentialsGood(securityState);
};

export const needsToRefreshToken = (securityState: SecurityState) => {
  return true;
};

export const areCredentialsGood = (securityState: SecurityState) => {
  return securityState && securityState.accessTokenInformation &&
    securityState.accessTokenInformation.expiresAt <= nowInSeconds()
};