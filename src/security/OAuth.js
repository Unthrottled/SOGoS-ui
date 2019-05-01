import type {SecurityState} from "../reducers/SecurityReducer";
import {nowInSeconds} from "@openid/appauth";


export const needsToLogIn = (securityState: SecurityState) => {
  return true;
};

export const needsToRefreshToken = (securityState: SecurityState) => {
  return true;
};

export const areCredentialsGood = (securityState: SecurityState) => {
  return securityState.accessTokenInformation.expiresAt <= nowInSeconds()
};