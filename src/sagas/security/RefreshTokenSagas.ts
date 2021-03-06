import {SecurityState} from '../../reducers/SecurityReducer';
import {GRANT_TYPE_REFRESH_TOKEN, TokenRequest} from '@openid/appauth';
import {createExpiredSessionEvent, FAILED_TO_RECEIVE_TOKEN, RECEIVED_TOKENS,} from '../../events/SecurityEvents';
import {call, fork, put, race, take} from 'redux-saga/effects';
import {createRequestForInitialConfigurations, FOUND_INITIAL_CONFIGURATION,} from '../../events/ConfigurationEvents';
import {OAuthConfig} from '../../types/ConfigurationTypes';
import {fetchTokenWithoutSessionRefreshSaga, fetchTokenWithRefreshSaga,} from './TokenSagas';
import {waitForWifi} from '../NetworkSagas';

export function* refreshTokenSaga(
  oauthConfig: OAuthConfig,
  securityState: SecurityState,
  fetchTokenSaga: (c: OAuthConfig, t: TokenRequest) => any,
) {
  yield call(waitForWifi);
  const refreshTokenRequest: TokenRequest = yield call(
    refreshTokenRequestSaga,
    securityState,
  );
  yield fork(fetchTokenSaga, oauthConfig, refreshTokenRequest);
  const {failureResponse} = yield race({
    successResponse: take(RECEIVED_TOKENS),
    failureResponse: take(FAILED_TO_RECEIVE_TOKEN),
  });

  if (failureResponse) {
    yield put(createExpiredSessionEvent()); // credentials are not good, just ask logon again please
  }
}

export function* refreshTokenWithoutReplacementSaga(
  oauthConfig: OAuthConfig,
  securityState: SecurityState,
) {
  yield call(
    refreshTokenSaga,
    oauthConfig,
    securityState,
    fetchTokenWithoutSessionRefreshSaga,
  );
}

export function* refreshTokenWithReplacementSaga(
  oauthConfig: OAuthConfig,
  securityState: SecurityState,
) {
  yield call(
    refreshTokenSaga,
    oauthConfig,
    securityState,
    fetchTokenWithRefreshSaga,
  );
}

export function* refreshTokenRequestSaga(securityState: SecurityState) {
  yield put(createRequestForInitialConfigurations());
  const {payload: initialConfigurations} = yield take(
    FOUND_INITIAL_CONFIGURATION,
  );
  return new TokenRequest({
    client_id: initialConfigurations.clientID,
    redirect_uri: initialConfigurations.callbackURI,
    grant_type: GRANT_TYPE_REFRESH_TOKEN,
    refresh_token: securityState.refreshToken
  });
}
