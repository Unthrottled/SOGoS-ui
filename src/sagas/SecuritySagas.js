import {takeEvery, put, all} from 'redux-saga/effects'
import {REQUESTED_SECURITY_UPDATE} from "../actions/SecurityActions";


function* securityRequestSaga() {
  yield put({type: 'COMMAND_AUTHENTICATED_STANDBY_FOR_TITAN_FALL'})
}

function* watchSecurityRequests() {
  yield takeEvery(REQUESTED_SECURITY_UPDATE, securityRequestSaga);
}

export default function* rootSaga(){
  yield all([
    watchSecurityRequests()
  ])
}