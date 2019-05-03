import {all, fork, put, take, takeEvery} from 'redux-saga/effects'
import {INITIALIZED_APPLICATION} from "../actions/ApplicationLifecycleActions";
import {RECEIVED_OAUTH_CONFIGURATION, requestOAuthConfigurations} from "../actions/ConfigurationActions";
import oauthInitializationSaga from './security/SecurityInitializationSaga';
import {REQUESTED_ACCESS_TOKEN, REQUESTED_LOGON} from "../actions/SecurityActions";
import loginSaga from "./security/LoginSaga";
import {accessTokenSaga} from "./security/AccessTokenSaga";

function* securityRequestSaga() {
  yield put(requestOAuthConfigurations()); // ask for oauth configurations
  const {payload: oauthConfig} = yield take(RECEIVED_OAUTH_CONFIGURATION); // yay configurations!
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