import {call, put} from 'redux-saga/effects'
import {performStreamedGet} from "../APISagas";
import {createReceivedHistoryEvent} from "../../events/HistoryEvents";
import {createShowWarningNotificationEvent} from "../../events/MiscEvents";

export const createHistoryAPIURL = guid => `/api/history/${guid}/feed`;

export function* archiveFetchSaga({payload: {information: {guid}}}) {
  try {
    const data = yield call(performStreamedGet, createHistoryAPIURL(guid));
    const sortedData = data.sort(((a, b) => b.antecedenceTime - a.antecedenceTime));
    yield put(createReceivedHistoryEvent(sortedData))
  } catch (e) {
    yield put(createShowWarningNotificationEvent("Unable to get activity history! Try again later, please."))
  }
}

export function* historyObservationSaga() {
  //todo: update history  when viewed again?
  yield call(console.log, 'Viewed history again');
}
