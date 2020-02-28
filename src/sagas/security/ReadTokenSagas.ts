import {SecurityState} from "../../reducers/SecurityReducer";
import {fork, select, take} from 'redux-saga/effects';
import {selectSecurityState} from "../../reducers";
import {nowInSeconds} from "@openid/appauth";
import {readOnlySaga} from "./ReadOnlySaga";
import {RECEIVED_READ_TOKEN} from "../../events/SecurityEvents";

export const isReadTokenValid = (securityState: SecurityState) => {
  return (
    securityState &&
    securityState.readTokenInformation &&
    securityState.readTokenInformation.expiresAt - 5 >= nowInSeconds()
  );
};

const shouldRefreshReadToken = (securityState: SecurityState) =>
  !isReadTokenValid(securityState);

export function* readTokenFetchSaga(){
  const securityState: SecurityState = yield select(selectSecurityState);
  if(shouldRefreshReadToken(securityState)) {
    yield fork(readOnlySaga);
    const readTokenPayload: any = take(RECEIVED_READ_TOKEN);
    return readTokenPayload.payload.readToken;
  }

  return securityState.readToken;
}

