import {all, fork, take, takeEvery} from 'redux-saga/effects'
import {ADJUSTED_HISTORY, VIEWED_HISTORY} from "../events/HistoryEvents";
import {RECEIVED_USER} from "../events/UserEvents";
import {historyAdjustmentSaga, historyInitializationSaga, historyObservationSaga} from "./history/ActivityHistorySagas";
import {capstoneHistorySaga} from "./history/CapstoneHistorySaga";

export function* initializeActivityFeedSaga() {
  const {foundUser} = yield all({
    askedForHistory: take(VIEWED_HISTORY),
    foundUser: take(RECEIVED_USER),
  });
  yield fork(historyInitializationSaga, foundUser);
  yield takeEvery(VIEWED_HISTORY, historyObservationSaga);
  yield takeEvery(ADJUSTED_HISTORY, historyAdjustmentSaga);
}

function* listenToActivityEvents() {
  yield fork(initializeActivityFeedSaga);
  yield takeEvery(ADJUSTED_HISTORY, capstoneHistorySaga);
}

export default function* HistorySagas() {
  yield all([
    listenToActivityEvents(),
  ]);
}
