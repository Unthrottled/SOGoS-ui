import {all, call, fork, put, take, takeEvery} from 'redux-saga/effects'
import {performStreamedGet} from "./APISagas";
import {createReceivedHistoryEvent, VIEWED_HISTORY} from "../events/HistoryEvents";
import {RECEIVED_USER} from "../events/UserEvents";

export function* archiveFetchSaga({payload: {information: {guid}}}) {
  try {
    const data = yield call(performStreamedGet, `/api/history/${guid}/feed`);
    yield put(createReceivedHistoryEvent(data))
  } catch (e) {
    //todo: handle unable to get history
    console.log('shit broked', e);
  }
}

export function* historyObservationSaga(){
  //todo: update history  when viewed again?
  yield call(console.log, 'Viewed history again');
}

function* listenToActivityEvents() {
  const {foundUser} = yield all({
    askedForHistory: take(VIEWED_HISTORY),
    foundUser: take(RECEIVED_USER),
  });
  yield fork(archiveFetchSaga, foundUser);
  yield takeEvery(VIEWED_HISTORY, historyObservationSaga);
}

export default function* HistorySagas() {
  yield all([
    listenToActivityEvents(),
  ])
}
