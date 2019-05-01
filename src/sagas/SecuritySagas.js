import {all, fork, put, take, takeEvery} from 'redux-saga/effects'
import {INITIALIZED_APPLICATION} from "../actions/ApplicationLifecycleActions";
import {RECEIVED_OAUTH_CONFIGURATION, requestOAuthConfigurations} from "../actions/ConfigurationActions";
import oauthInitializationSaga from './security/SecurityInitializationSaga';
import {createLoggedOnAction} from "../actions/SecurityActions";

function* securityRequestSaga() {
  yield put(requestOAuthConfigurations()); // ask for oauth configurations
  const {payload: oauthConfig} = yield take(RECEIVED_OAUTH_CONFIGURATION); // yay configurations!
  yield oauthInitializationSaga(oauthConfig);// Log user in or refresh tokens
  yield put(createLoggedOnAction());
}

function* listenToStartupEvent() {
  yield takeEvery(INITIALIZED_APPLICATION, securityRequestSaga)
}

function* listenToAppLifecycleEvents() {
  yield fork(listenToStartupEvent);
}

export default function* rootSaga() {
  yield all([
    listenToAppLifecycleEvents()
  ])
}