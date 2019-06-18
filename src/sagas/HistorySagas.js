import {all, call, put, takeEvery} from 'redux-saga/effects'
import {performStreamedGet} from "./APISagas";
import {createReceivedHistoryEvent} from "../events/HistoryEvents";
import {RECEIVED_USER} from "../events/UserEvents";

export function* archiveFetchSaga({payload: {information: {guid}}}) {
  try {
    const data = yield call(performStreamedGet, `./api/history/${guid}/feed`);
    yield put(createReceivedHistoryEvent(data))
  } catch (e) {
    //todo: handle unable to get history
    console.log('shit broked', e);
  }
}

function* listenToActivityEvents() {
  yield takeEvery(RECEIVED_USER, archiveFetchSaga);
}

export default function* HistorySagas() {
  yield all([
    listenToActivityEvents(),
  ])
}
