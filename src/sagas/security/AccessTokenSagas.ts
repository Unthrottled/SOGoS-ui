import {call, put, select} from 'redux-saga/effects';
import {canRefreshToken} from '../../security/OAuth';
import {
  refreshTokenWithoutReplacementSaga,
  refreshTokenWithReplacementSaga,
} from './RefreshTokenSagas';
import {SessionExpiredException} from '../../types/SecurityTypes';
import {SecurityState} from '../../reducers/SecurityReducer';
import {selectSecurityState} from '../../reducers';
import {createForcedLoginEvent} from '../../events/SecurityEvents';

export function* accessTokenWithSessionExtensionSaga() {
  return yield call(
    accessTokenSagas,
    getOrRefreshAccessTokenWithSessionExtension,
  );
}

export function* accessTokenWithoutSessionExtensionSaga() {
  return yield call(
    accessTokenSagas,
    getOrRefreshAccessTokenWithoutSessionExtension,
  );
}

export function* accessTokenSagas(getOrRefreshAccessTokenSaga: () => any) {
  const accessToken = yield call(getOrRefreshAccessTokenSaga);
  if (accessToken) {
    return accessToken;
  } else {
    throw new SessionExpiredException();
  }
}

export function* getOrRefreshAccessTokenWithSessionExtension() {
  return yield call(
    getOrRefreshAccessToken,
    refreshTokenWithReplacementSaga,
    canRefreshToken,
  );
}

export function* getOrRefreshAccessTokenWithoutSessionExtension() {
  return yield call(
    getOrRefreshAccessToken,
    refreshTokenWithoutReplacementSaga,
    canRefreshToken,
  );
}

export function* getOrRefreshAccessToken(
  refreshTokenSaga: (arg0: any, arg2: any) => any,
  shouldTokenRefresh: (arg0: SecurityState) => boolean,
) {
  const security: SecurityState = yield select(selectSecurityState);
  if (shouldTokenRefresh(security) && security.isInitialized) {
    // Cannot refresh tokens, just go back to the
    // auth server and hope for the best...
    yield put(createForcedLoginEvent());
  }
  return security.accessToken;
}
