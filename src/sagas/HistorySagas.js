import {all, fork, take, takeEvery} from 'redux-saga/effects'
import {ADJUSTED_HISTORY, VIEWED_HISTORY} from "../events/HistoryEvents";
import {RECEIVED_USER} from "../events/UserEvents";
import {archiveFetchSaga, historyAdjustmentSaga, historyObservationSaga} from "./history/ActivityHistorySagas";

export function* initializeActivityFeedSaga() {
  const {foundUser} = yield all({
    askedForHistory: take(VIEWED_HISTORY),
    foundUser: take(RECEIVED_USER),
  });
  yield fork(archiveFetchSaga, foundUser);
  yield takeEvery(VIEWED_HISTORY, historyObservationSaga);
  yield takeEvery(ADJUSTED_HISTORY, historyAdjustmentSaga);
}

function* listenToActivityEvents() {
  yield fork(initializeActivityFeedSaga);
}

export default function* HistorySagas() {
  yield all([
    listenToActivityEvents(),
  ]);
}
