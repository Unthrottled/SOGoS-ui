import {takeEvery, put, fork, all} from 'redux-saga/effects'
import {INITIALIZED_APPLICATION} from "../actions/ApplicationLifecycleActions";

function* securityRequestSaga() {
  yield put({type: 'COMMAND_AUTHENTICATED_STANDBY_FOR_TITAN_FALL'})
  // Make sure that credentials are up to date
}

function* watchStartupEvent(){
  yield takeEvery(INITIALIZED_APPLICATION, securityRequestSaga)
}

function* watchAppLifecycleEvents() {
  yield fork(watchStartupEvent);
}

export default function* rootSaga(){
  yield all([
    watchAppLifecycleEvents()
  ])
}