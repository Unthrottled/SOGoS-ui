import {call, put} from 'redux-saga/effects'
import {performStreamedGet} from "../APISagas";
import {createReceivedHistoryEvent} from "../../events/HistoryEvents";
import {createShowWarningNotificationEvent} from "../../events/MiscEvents";

export const createHistoryAPIURL = (guid, from, to) =>
  `/api/history/${guid}/feed?from=${from}&to=${to}`;

const meow = new Date();
const SEVEN_DAYS = 604800000;
const meowMinusSeven = new Date(meow.getTime() - SEVEN_DAYS);

export function* archiveFetchSaga({payload: {information: {guid}}},
                                  fromDate: number = meowMinusSeven.getTime(),
                                  toDate: number = meow.getTime()) {
  try {
    const data = yield call(performStreamedGet, createHistoryAPIURL(guid, fromDate, toDate));
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
