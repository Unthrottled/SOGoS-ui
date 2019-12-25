import {all, takeEvery} from "redux-saga/effects";
import {STARTED_NON_TIMED_ACTIVITY, STARTED_TIMED_ACTIVITY} from "../events/ActivityEvents";
import {nonSandsOfTimeSaga, sandsOfTimeSaga} from "./time/SandsOfTimeSaga";

function* listenToActivityEvents() {
  yield takeEvery(STARTED_TIMED_ACTIVITY, sandsOfTimeSaga);
  yield takeEvery(STARTED_NON_TIMED_ACTIVITY, nonSandsOfTimeSaga);
}


export default function* rootSaga() {
  yield all([
    listenToActivityEvents(),
  ])
}
