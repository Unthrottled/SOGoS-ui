import {all, fork, put, take, takeEvery} from 'redux-saga/effects'
import {INITIALIZED_APPLICATION} from "../actions/ApplicationLifecycleActions";
import oauthInitializationSaga from './security/SecurityInitializationSaga';
import {REQUESTED_ACCESS_TOKEN, REQUESTED_LOGON} from "../actions/SecurityActions";
import loginSaga from "./security/LoginSaga";
import {accessTokenSaga} from "./security/AccessTokenSaga";
import {oAuthConfigurationSaga} from "./ConfigurationSagas";

function* securityRequestSaga() {
  const oauthConfig = yield oAuthConfigurationSaga();
  yield oauthInitializationSaga(oauthConfig);// Log user in or refresh tokens
}

function* listenToStartupEvent() {
  yield takeEvery(INITIALIZED_APPLICATION, securityRequestSaga)
}

function* listenToAccessTokenRequestEvents() {
  yield takeEvery(REQUESTED_ACCESS_TOKEN, accessTokenSaga)
}

function* listenToAppLifecycleEvents() {
  yield fork(listenToStartupEvent);
}

function* listenToLoginEvents() {
  yield takeEvery(REQUESTED_LOGON, loginSaga)
}

export default function* rootSaga() {
  yield all([
    listenToAppLifecycleEvents(),
    listenToLoginEvents(),
    listenToAccessTokenRequestEvents(),
  ])
}