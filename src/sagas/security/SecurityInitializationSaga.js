import {call, put, select, take} from 'redux-saga/effects'
import {canRefreshToken, shouldCheckForAuthorizationGrant} from "../../security/OAuth";
import {
  CHECKED_AUTH,
  createSecurityInitializedEvent,
  requestAuthorizationGrantCheck
} from "../../events/SecurityEvents";
import {refreshTokenWithReplacementSaga} from "./RefreshTokenSagas";
import type {OAuthConfig} from "../../reducers/ConfigurationReducer";

function* oauthInitializationSaga(oauthConfig: OAuthConfig) {
  const {security} = yield select();
  if (canRefreshToken(security)) {
    yield call(refreshTokenWithReplacementSaga, oauthConfig, security);
  } else if (shouldCheckForAuthorizationGrant(security)) {
    yield put(requestAuthorizationGrantCheck(oauthConfig)); // ask to check if there is an authorization grant.
    yield take(CHECKED_AUTH); // wait until checked
  }
  yield put(createSecurityInitializedEvent());
}

export default oauthInitializationSaga;
