import type {SecurityState} from "../../reducers/SecurityReducer";
import {GRANT_TYPE_REFRESH_TOKEN, TokenRequest} from "@openid/appauth";
import {createRequestLogonEvent, createTokenFailureEvent} from "../../events/SecurityEvents";
import {put, take} from 'redux-saga/effects'
import {createRequestForInitialConfigurations, FOUND_INITIAL_CONFIGURATION} from "../../events/ConfigurationEvents";
import type {OauthConfig} from "../../reducers/ConfigurationReducer";
import {fetchTokenSaga} from "./TokenSagas";

export function* refreshTokenSaga(oauthConfig: OauthConfig, securityState: SecurityState) {
  const refreshTokenRequest: TokenRequest = yield refreshTokenRequestSaga(securityState);
  try {
    yield fetchTokenSaga(oauthConfig, refreshTokenRequest)
  } catch (e) {
    // todo: handle offline
    yield put(createRequestLogonEvent(oauthConfig));// credentials are not good, just logon again please
    yield put(createTokenFailureEvent(refreshTokenRequest));
  }
}

export function* refreshTokenRequestSaga(securityState: SecurityState): TokenRequest{
  yield put(createRequestForInitialConfigurations());
  const {payload: initialConfigurations} = yield take(FOUND_INITIAL_CONFIGURATION);
  return new TokenRequest({
    client_id: initialConfigurations.clientID,
    redirect_uri: initialConfigurations.callbackURI,
    grant_type: GRANT_TYPE_REFRESH_TOKEN,
    refresh_token: securityState.refreshToken
  });
}
