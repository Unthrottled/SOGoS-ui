import {all, call, put, takeEvery} from 'redux-saga/effects'
import {INITIALIZED_SECURITY} from "../events/SecurityEvents";
import {performStreamedGet} from "./APISagas";
import {createReceivedHistoryEvent} from "../events/HistoryEvents";

export function* archiveFetchSaga() {
  try {
    const data = yield call(performStreamedGet, './api/history/feed');
    console.log(data);
    yield put(createReceivedHistoryEvent(data))
  } catch (e) {
    //todo: handle unable to get history
    console.log('shit broked', e);
  }
}

function* listenToActivityEvents() {
  yield takeEvery(INITIALIZED_SECURITY, archiveFetchSaga);
}

export default function* HistorySagas() {
  yield all([
    listenToActivityEvents(),
  ])
}
