import {takeEvery, take, put, fork, all} from 'redux-saga/effects'
import {INITIALIZED_APPLICATION} from "../actions/ApplicationLifecycleActions";
import {RECEIVED_OAUTH_CONFIGURATION, requestOAuthConfigurations} from "../actions/ConfigurationActions";

function* securityRequestSaga() {
  // Make sure that credentials are up to date
  yield put(requestOAuthConfigurations()); // ask for oauth configurations
  yield take(RECEIVED_OAUTH_CONFIGURATION); // Wait for response
  yield put({type: 'THANKS_FOR_THE_CANDY'});
}

function* listenToStartupEvent(){
  yield takeEvery(INITIALIZED_APPLICATION, securityRequestSaga)
}

function* listenToAppLifecycleEvents() {
  yield fork(listenToStartupEvent);
}

export default function* rootSaga(){
  yield all([
    listenToAppLifecycleEvents()
  ])
}