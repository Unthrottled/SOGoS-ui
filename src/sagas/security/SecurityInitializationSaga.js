import {call, put, select} from 'redux-saga/effects'
import {BaseTokenRequestHandler, TokenRequestHandler} from "@openid/appauth";
import {canRefreshToken, needsToLogIn} from "../../security/OAuth";
import {createSecurityInitalizedEvent, createTokenReceptionEvent, requestLogon} from "../../actions/SecurityActions";
import {refreshTokenSaga} from "./RefreshTokenSaga";

const tokenHandler: TokenRequestHandler = new BaseTokenRequestHandler();

export function* getNewTokens(oauthConfig, tokenRequest) {
  const tokenResponse = yield call(() => tokenHandler.performTokenRequest(oauthConfig, tokenRequest));
  yield put(createTokenReceptionEvent(tokenResponse));
}

function* oauthInitializationSaga(oauthConfig) {
  const {security} = yield select();
  if (canRefreshToken(security)) {
    yield refreshTokenSaga(oauthConfig, security);
  } else if (needsToLogIn(security)) {
    yield put(requestLogon(oauthConfig));
  }
  yield put(createSecurityInitalizedEvent());
}

export default oauthInitializationSaga;