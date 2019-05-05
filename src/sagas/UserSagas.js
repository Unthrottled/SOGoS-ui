import {all, takeEvery, put } from 'redux-saga/effects'
import {LOGGED_ON} from "../events/SecurityEvents";
import {performGet} from "./APISagas";
import {receivedUser} from "../events/UserEvents";

function* findUserSaga() {
  const {data: user} = yield performGet('./api/user');
  yield put(receivedUser(user)); // found waldo.
}

function* listenToSecurityEvents() {
  yield takeEvery(LOGGED_ON, findUserSaga)
}

export default function* rootSaga() {
  yield all([
    listenToSecurityEvents(),
  ])
}
