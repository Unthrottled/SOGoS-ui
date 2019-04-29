import type {SecurityState} from "../reducers/SecurityReducer";


export const needsToLogIn = (securityState: SecurityState) => {
  return true;
};

export const needsToRefreshToken = (securityState: SecurityState) => {
  return true;
};