import {all, takeEvery} from 'redux-saga/effects'
import {STARTED_ACTIVITY} from "../events/ActivityEvents";

export function* archiveActivitySaga() {
  console.log('finna bust a nut');
}

function* listenToActivityEvents() {
  yield takeEvery(STARTED_ACTIVITY, archiveActivitySaga);
}

export default function* HistorySagas() {
  yield all([
    listenToActivityEvents(),
  ])
}
