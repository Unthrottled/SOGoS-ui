import {call, put, select} from 'redux-saga/effects'
import {BaseTokenRequestHandler, GRANT_TYPE_REFRESH_TOKEN, TokenRequest, TokenRequestHandler} from "@openid/appauth";
import {canRefreshToken, needsToLogIn} from "../../security/OAuth";
import {createTokenReceptionEvent, requestLogon} from "../../actions/SecurityActions";
import type {SecurityState} from "../../reducers/SecurityReducer";

const tokenHandler: TokenRequestHandler = new BaseTokenRequestHandler();

export function* getNewTokens(oauthConfig, tokenRequest) {
  const tokenResponse = yield call(() => tokenHandler.performTokenRequest(oauthConfig, tokenRequest));
  yield put(createTokenReceptionEvent(tokenResponse));
}

function* performLogin(oauthConfig) {

}

function* refreshTokenSaga(oauthConfig, securityState: SecurityState) {
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

function* oauthInitializationSaga(oauthConfig) {
  const {security} = yield select();
  if (canRefreshToken(security)) {
    yield refreshTokenSaga(oauthConfig, security);
  } else if (needsToLogIn(security)) {
    yield put(requestLogon(oauthConfig));
  }
}

export default oauthInitializationSaga;