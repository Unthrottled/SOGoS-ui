import {call, put} from 'redux-saga/effects'
import {performStreamedGet} from "../APISagas";
import {createReceivedHistoryEvent} from "../../events/HistoryEvents";

export const createHistoryAPIURL = guid => `/api/history/${guid}/feed`;

export function* archiveFetchSaga({payload: {information: {guid}}}) {
  try {
    const data = yield call(performStreamedGet, createHistoryAPIURL(guid));
    const sortedData = data.sort(((a, b) => b.antecedenceTime - a.antecedenceTime));
    yield put(createReceivedHistoryEvent(sortedData))
  } catch (e) {
    //todo: handle unable to get history
    console.log('shit broked', e);
  }
}

export function* historyObservationSaga() {
  //todo: update history  when viewed again?
  yield call(console.log, 'Viewed history again');
}
