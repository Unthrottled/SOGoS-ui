import {call, fork, race, select, take} from 'redux-saga/effects';
import {FAILED_TO_RECEIVE_TOKEN, RECEIVED_TOKENS} from "../../events/SecurityEvents";
import {canRefreshToken} from "../../security/OAuth";
import {refreshTokenWithReplacementSaga, refreshTokenWithoutReplacementSaga} from "./RefreshTokenSagas";
import {oauthConfigurationSaga} from "../configuration/ConfigurationConvienenceSagas";

export function* accessTokenSagas() {
  const accessToken = yield call(getOrRefreshAccessToken);
  if (accessToken) {
    return accessToken;
  } else {
    // todo: ask user to sign in again.
  }
}

export function* accessTokenWithSessionExtensionSaga() {
  return yield call(accessTokenSagas, getOrRefreshAccessToken);
}

export function* accessTokenWithoutSessionExtensionSagas() {
  return yield call(accessTokenSagas, getOrRefreshAccessToken);
}

export function* getOrRefreshAccessToken(refreshTokenSaga) {
  const {security} = yield select();
  if (canRefreshToken(security)) {
    const oauthConfiguration = yield call(oauthConfigurationSaga);
    yield fork(refreshTokenSaga, oauthConfiguration, security);
    return yield call(awaitToken);
  } else {
    return security.accessToken
  }
}
export function* getOrRefreshAccessToken() {
  return yield call(getOrRefreshAccessToken, refreshTokenWithReplacementSaga);
}

export function* getOrRefreshAccessToken() {
  return yield call(getOrRefreshAccessToken, refreshTokenWithoutReplacementSaga);
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
