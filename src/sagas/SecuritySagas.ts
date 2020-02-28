import {all, call, delay, fork, takeEvery} from 'redux-saga/effects';
import {INITIALIZED_APPLICATION} from '../events/ApplicationLifecycleEvents';
import oauthInitializationSaga from './security/SecurityInitializationSaga';
import {
  FORCED_LOGIN,
  REQUESTED_AUTH_CHECK,
  REQUESTED_LOGOFF,
  REQUESTED_LOGON,
  REQUESTED_READ_ONLY_MODE,
} from '../events/SecurityEvents';
import {authorizationGrantSaga, loginSaga,} from './security/AuthorizationFlowSagas';
import logoutSaga from './security/LogoutSaga';
import {oauthConfigurationSaga} from './configuration/ConfigurationConvienenceSagas';
import {readOnlySaga} from "./security/ReadOnlySaga";

function* securityRequestSaga() {
  const oauthConfig = yield oauthConfigurationSaga();
  yield oauthInitializationSaga(oauthConfig); // Log user in or refresh tokens
}

function* listenToStartupEvent() {
  yield takeEvery(INITIALIZED_APPLICATION, securityRequestSaga);
}

function* listenToAppLifecycleEvents() {
  yield fork(listenToStartupEvent);
}

function* listenToLoginEvents() {
  yield takeEvery(REQUESTED_LOGON, loginSaga);
  yield takeEvery(REQUESTED_LOGOFF, logoutSaga);
}

// Wait for all other decoupled events
// to complete before sending user off
// to the authorization server.
function* waitBeforeLoggingIn() {
  yield delay(2000);
  // yield call(loginSaga);
}

function* listenToSecurityEvents() {
  yield takeEvery(REQUESTED_AUTH_CHECK, authorizationGrantSaga);
  yield takeEvery(FORCED_LOGIN, waitBeforeLoggingIn);
  yield takeEvery(REQUESTED_READ_ONLY_MODE, readOnlySaga);
}

export default function* rootSaga() {
  yield all([
    listenToAppLifecycleEvents(),
    listenToLoginEvents(),
    listenToSecurityEvents(),
  ]);
}
