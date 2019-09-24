import {all, call, fork, take, takeEvery} from 'redux-saga/effects'
import {ADJUSTED_HISTORY, INITIALIZED_HISTORY, VIEWED_HISTORY} from "../events/HistoryEvents";
import {RECEIVED_USER} from "../events/UserEvents";
import {
  currentActivityHistorySaga,
  historyAdjustmentSaga,
  historyInitializationSaga,
  historyObservationSaga
} from "./history/ActivityHistorySagas";
import type {FullRangeAndFeed} from "./history/CapstoneHistorySaga";
import {capstoneHistorySaga, getFullHistory} from "./history/CapstoneHistorySaga";
import type {DateRange} from "../reducers/HistoryReducer";
import {
  INITIALIZED_CURRENT_ACTIVITY,
  RESUMED_NON_TIMED_ACTIVITY,
  RESUMED_TIMED_ACTIVITY,
  STARTED_ACTIVITY
} from "../events/ActivityEvents";

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
  yield takeEvery(ADJUSTED_HISTORY, historyAdjustmentCapstoneSaga);
  yield takeEvery(INITIALIZED_HISTORY, historyInitializationCapstoneSaga);
}

export function* historyAdjustmentCapstoneSaga({payload}) {
  const dateRange: DateRange = payload;
  const fullRangeAndFeed = yield call(getFullHistory, dateRange);
  yield call(capstoneHistorySaga, dateRange, fullRangeAndFeed);
}

export function* historyInitializationCapstoneSaga({payload}) {
  const {full} = payload;
  const fullRangeAndActivities: FullRangeAndFeed = {
    timeRange: full.between,
    activities: full.activities,
  };
  yield call(capstoneHistorySaga, full.between, fullRangeAndActivities);
}

export function* listenToCurrentActivityEvents() {
  yield takeEvery(STARTED_ACTIVITY, currentActivityHistorySaga);
  yield takeEvery(RESUMED_TIMED_ACTIVITY, currentActivityHistorySaga);
  yield takeEvery(RESUMED_NON_TIMED_ACTIVITY, currentActivityHistorySaga);
  yield takeEvery(INITIALIZED_CURRENT_ACTIVITY, currentActivityHistorySaga);
}

export default function* HistorySagas() {
  yield all([
    listenToActivityEvents(),
    listenToCurrentActivityEvents(),
  ]);
}
