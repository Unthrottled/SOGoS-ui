import {takeEvery, put, fork, all} from 'redux-saga/effects'
import {fetchOAuthConfigurations, REQUESTED_OAUTH_CONFIGURATION} from "../actions/ConfigurationActions";


function* securityRequestSaga() {
  yield put(fetchOAuthConfigurations()) //todo: handle failures.
}

function* listenToConfigurationEvent(){
  yield takeEvery(REQUESTED_OAUTH_CONFIGURATION, securityRequestSaga)
}

function* listenToApplicationEvents() {
  yield fork(listenToConfigurationEvent);
}

export default function* rootSaga(){
  yield all([
    listenToApplicationEvents()
  ])
}