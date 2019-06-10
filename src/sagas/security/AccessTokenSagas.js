import {call, fork, race, select, take} from 'redux-saga/effects';
import {FAILED_TO_RECEIVE_TOKEN, RECEIVED_TOKENS} from "../../events/SecurityEvents";
import {canRefreshToken} from "../../security/OAuth";
import {refreshTokenSaga} from "./RefreshTokenSagas";
import {oauthConfigurationSaga} from "../configuration/ConfigurationConvienenceSagas";

export function* accessTokenSagas() {
  const accessToken = yield call(getOrRefreshAccessToken);
  if (accessToken) {
    return accessToken;
  } else {
    // todo: ask user to sign in again.
  }
}

export function* getOrRefreshAccessToken() {
  const {security} = yield select();
  if (canRefreshToken(security)) {
    const oauthConfiguration = yield call(oauthConfigurationSaga);
    yield fork(refreshTokenSaga, oauthConfiguration, security);
    return yield call(awaitToken);
  } else {
    return security.accessToken
  }
}

export function* awaitToken(): string {
  const {tokenReception} = yield race({
    tokenReception: take(RECEIVED_TOKENS),
    tokenFailure: take(FAILED_TO_RECEIVE_TOKEN),
  });
  const {payload} = tokenReception || {};
  const {accessToken} = payload || {};
  return accessToken
}
