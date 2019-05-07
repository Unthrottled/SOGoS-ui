import {call, put, select, take} from 'redux-saga/effects'
import {BaseTokenRequestHandler, TokenRequestHandler} from "@openid/appauth";
import {canRefreshToken, shouldCheckForAuthorizationGrant} from "../../security/OAuth";
import {
  CHECKED_AUTH,
  createSecurityInitializedEvent,
  createTokenReceptionEvent,
  requestAuthorizationGrantCheck
} from "../../events/SecurityEvents";
import {refreshTokenSagas} from "./RefreshTokenSagas";

const tokenHandler: TokenRequestHandler = new BaseTokenRequestHandler();

export function* fetchTokenSaga(oauthConfig, tokenRequest) {
  const tokenResponse = yield call(() => tokenHandler.performTokenRequest(oauthConfig, tokenRequest));
  yield put(createTokenReceptionEvent(tokenResponse));
}

function* oauthInitializationSaga(oauthConfig) {
  const {security} = yield select();
  if (canRefreshToken(security)) {
    yield refreshTokenSagas(oauthConfig, security);
  } else if (shouldCheckForAuthorizationGrant(security)) {
    yield put(requestAuthorizationGrantCheck(oauthConfig)); // ask to check if there is an authorization grant.
    yield take(CHECKED_AUTH); // wait until checked
  }
  yield put(createSecurityInitializedEvent());
}

export default oauthInitializationSaga;
