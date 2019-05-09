import {put, select, take, call} from 'redux-saga/effects'
import {canRefreshToken, shouldCheckForAuthorizationGrant} from "../../security/OAuth";
import {
  CHECKED_AUTH,
  createSecurityInitializedEvent,
  requestAuthorizationGrantCheck
} from "../../events/SecurityEvents";
import {refreshTokenSaga} from "./RefreshTokenSagas";
import type {OauthConfig} from "../../reducers/ConfigurationReducer";

function* oauthInitializationSaga(oauthConfig: OauthConfig) {
  const {security} = yield select();
  if (canRefreshToken(security)) {
    yield call(refreshTokenSaga,oauthConfig, security);
  } else if (shouldCheckForAuthorizationGrant(security)) {
    yield put(requestAuthorizationGrantCheck(oauthConfig)); // ask to check if there is an authorization grant.
    yield take(CHECKED_AUTH); // wait until checked
  }
  yield put(createSecurityInitializedEvent());
}

export default oauthInitializationSaga;
