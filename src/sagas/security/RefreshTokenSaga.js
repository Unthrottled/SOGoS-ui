import type {SecurityState} from "../../reducers/SecurityReducer";
import {GRANT_TYPE_REFRESH_TOKEN, TokenRequest} from "@openid/appauth";
import {requestLogon} from "../../actions/SecurityActions";
import {getNewTokens} from "./SecurityInitializationSaga";
import {put} from 'redux-saga/effects'

export function* refreshTokenSaga(oauthConfig, securityState: SecurityState) {
  const refreshTokenRequest = new TokenRequest({
    client_id: 'sogos-app',
    redirect_uri: 'http://localhost:3000',
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
