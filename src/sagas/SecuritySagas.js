import {all, fork, takeEvery} from 'redux-saga/effects'
import {INITIALIZED_APPLICATION} from "../events/ApplicationLifecycleEvents";
import oauthInitializationSaga from './security/SecurityInitializationSaga';
import {
  REQUESTED_ACCESS_TOKEN,
  REQUESTED_AUTH_CHECK,
  REQUESTED_LOGOFF,
  REQUESTED_LOGON
} from "../events/SecurityEvents";
import {authorizationGrantSaga, loginSaga} from "./security/AuthorizationFlowSagas";
import {accessTokenSagas} from "./security/AccessTokenSagas";
import {oAuthConfigurationSaga} from "./ConfigurationSagas";
import logoutSaga from "./security/LogoutSaga";

function* securityRequestSaga() {
  const oauthConfig = yield oAuthConfigurationSaga();
  yield oauthInitializationSaga(oauthConfig);// Log user in or refresh tokens
}

function* listenToStartupEvent() {
  yield takeEvery(INITIALIZED_APPLICATION, securityRequestSaga)
}

function* listenToAccessTokenRequestEvents() {
  yield takeEvery(REQUESTED_ACCESS_TOKEN, accessTokenSagas)
}

function* listenToAppLifecycleEvents() {
  yield fork(listenToStartupEvent);
}

function* listenToLoginEvents() {
  yield takeEvery(REQUESTED_LOGON, loginSaga);
  yield takeEvery(REQUESTED_LOGOFF, logoutSaga);
}

function* listenToSecurityEvents() {
  yield takeEvery(REQUESTED_AUTH_CHECK, authorizationGrantSaga);
}

export default function* rootSaga() {
  yield all([
    listenToAppLifecycleEvents(),
    listenToLoginEvents(),
    listenToAccessTokenRequestEvents(),
    listenToSecurityEvents(),
  ])
}
