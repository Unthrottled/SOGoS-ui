import {all, takeEvery, put } from 'redux-saga/effects'
import {LOGGED_ON} from "../events/SecurityEvents";
import {performGet} from "./APISagas";
import {createReceivedUserEvent, createFailedToGetUserEvent} from "../events/UserEvents";

export function* findUserSaga() {
  try {
    const {data: user} = yield performGet('./api/user');
    yield put(createReceivedUserEvent(user)); // found waldo.
  } catch (e) {
    yield put(createFailedToGetUserEvent(e));
  }
}

function* listenToSecurityEvents() {
  yield takeEvery(LOGGED_ON, findUserSaga)
}

export default function* rootSaga() {
  yield all([
    listenToSecurityEvents(),
  ])
}
