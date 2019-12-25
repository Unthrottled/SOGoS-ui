import {all, takeEvery} from "redux-saga/effects";
import {STARTED_TIMED_ACTIVITY} from "../events/ActivityEvents";

function* sandsOfTimeSaga() {
  // oh shit imma have to do stuff...
}


function* listenToActivityEvents() {
  yield  takeEvery(STARTED_TIMED_ACTIVITY, sandsOfTimeSaga)
}


export default function* rootSaga() {
  yield all([
    listenToActivityEvents(),
  ])
}
