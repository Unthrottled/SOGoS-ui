import {call, fork, put, race, select, take} from 'redux-saga/effects';
import {createFoundAccessTokenEvent, FAILED_TO_RECEIVE_TOKEN, RECEIVED_TOKENS} from "../../events/SecurityEvents";
import {canRefreshToken} from "../../security/OAuth";
import {refreshTokenSaga} from "./RefreshTokenSagas";
import {oAuthConfigurationSaga} from "../configuration/ConfigurationConvienenceSagas";

// todo: do not respond with undefined token
export function* accessTokenSagas() {
  const accessToken = yield call(getOrRefreshAccessToken);
  if (accessToken) {
    yield put(createFoundAccessTokenEvent(accessToken));
  } else {
    // try again?
  }
}

export function* getOrRefreshAccessToken() {
  const {security} = yield select();
  if (canRefreshToken(security)) {
    const oAuthConfiguration = yield call(oAuthConfigurationSaga);
    yield fork(refreshTokenSaga, oAuthConfiguration, security);
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
