import {call, race, select, take} from 'redux-saga/effects';
import {FAILED_TO_RECEIVE_TOKEN, RECEIVED_TOKENS} from "../../events/SecurityEvents";
import {canRefreshToken} from "../../security/OAuth";
import {refreshTokenWithoutReplacementSaga, refreshTokenWithReplacementSaga} from "./RefreshTokenSagas";
import {SessionExpiredException} from "../../types/SecurityModels";

export function* accessTokenWithSessionExtensionSaga() {
  return yield call(accessTokenSagas, getOrRefreshAccessTokenWithSessionExtension);
}

export function* accessTokenWithoutSessionExtensionSaga() {
  return yield call(accessTokenSagas, getOrRefreshAccessTokenWithoutSessionExtension);
}

export function* accessTokenSagas(getOrRefreshAccessTokenSaga) {
  const accessToken = yield call(getOrRefreshAccessTokenSaga);
  if (accessToken) {
    return accessToken;
  } else {
    throw new SessionExpiredException();
  }
}

export function* getOrRefreshAccessTokenWithSessionExtension() {
  return yield call(getOrRefreshAccessToken, refreshTokenWithReplacementSaga, canRefreshToken);
}

export function* getOrRefreshAccessTokenWithoutSessionExtension() {
  return yield call(getOrRefreshAccessToken, refreshTokenWithoutReplacementSaga, canRefreshToken);
}

export function* getOrRefreshAccessToken(refreshTokenSaga, shouldTokenRefresh) {
  const {security} = yield select();
  if (shouldTokenRefresh(security)) {
    throw new SessionExpiredException();
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
