import type {SecurityState} from "../../reducers/SecurityReducer";
import {GRANT_TYPE_REFRESH_TOKEN, TokenRequest} from "@openid/appauth";
import {requestLogon} from "../../events/SecurityEvents";
import {getNewTokens} from "./SecurityInitializationSaga";
import {put} from 'redux-saga/effects'
import {createRequestForInitialConfigurations, FOUND_INITIAL_CONFIGURATION} from "../../events/ConfigurationEvents";
import {take} from "redux-saga-test-plan/matchers";

export function* refreshTokenSaga(oauthConfig, securityState: SecurityState) {
  yield put(createRequestForInitialConfigurations());
  const {payload: initialConfigurations} = yield take(FOUND_INITIAL_CONFIGURATION);
  const refreshTokenRequest = new TokenRequest({
    client_id: initialConfigurations.clientID,
    redirect_uri: initialConfigurations.callbackURI,
    grant_type: GRANT_TYPE_REFRESH_TOKEN,
    refresh_token: securityState.refreshToken
  });
  try {
    yield getNewTokens(oauthConfig, refreshTokenRequest)
  } catch (e) {
    // todo: handle offline
    yield put(requestLogon(oauthConfig)) // credentials are not good, just logon again please
  }
}
