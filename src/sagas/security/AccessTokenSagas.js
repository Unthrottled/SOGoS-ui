import {call, fork, put, race, select, take} from 'redux-saga/effects';
import {createFoundAccessTokenEvent, FAILED_TO_RECEIVE_TOKEN, RECEIVED_TOKENS} from "../../events/SecurityEvents";
import {canRefreshToken} from "../../security/OAuth";
import {refreshTokenSaga} from "./RefreshTokenSagas";
import {oauthConfigurationSaga} from "../configuration/ConfigurationConvienenceSagas";

export function* accessTokenSagas() {
  const accessToken = yield call(getOrRefreshAccessToken);
  if (accessToken) {
    yield put(createFoundAccessTokenEvent(accessToken));
  } else {
    // todo: activate offline mode.
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
