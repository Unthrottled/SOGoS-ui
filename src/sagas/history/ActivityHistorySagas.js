import {call, put, select} from 'redux-saga/effects'
import {performStreamedGet} from "../APISagas";
import {createInitializedHistoryEvent} from "../../events/HistoryEvents";
import {createShowWarningNotificationEvent} from "../../events/MiscEvents";
import {selectHistoryState} from "../../reducers";
import type {HistoryState} from "../../reducers/HistoryReducer";
import {binarySearch} from "../../miscellanous/Tools";
import type {Activity} from "../../types/ActivityModels";

export const createHistoryAPIURL = (guid, from, to) =>
  `/api/history/${guid}/feed?from=${from}&to=${to}`;

const meow = new Date();
const SEVEN_DAYS = 604800000;
const meowMinusSeven = new Date(meow.getTime() - SEVEN_DAYS);

export function* archiveFetchSaga(guid,
                                  fromDate: number,
                                  toDate: number) {
  try {
    const data = yield call(performStreamedGet, createHistoryAPIURL(guid, fromDate, toDate));
    return data.sort(((a, b) => b.antecedenceTime - a.antecedenceTime));
  } catch (e) {
    yield put(createShowWarningNotificationEvent("Unable to get activity history! Try again later, please."))
    return [];
  }
}

export function* historyInitializationSaga({payload: {information: {guid}}}) {
  const fromDate = meowMinusSeven.valueOf() - 1;
  const toDate = meow.valueOf() + 1;
  const initialHistoryFeed = yield call(archiveFetchSaga, guid, fromDate, toDate);
  yield put(createInitializedHistoryEvent({
    selection: {
      activities: initialHistoryFeed,
      between :{
        from: meowMinusSeven.valueOf(),
        to: meow.valueOf(),
      }
    },
    full : {
      activities: initialHistoryFeed,
      between :{
        from: fromDate,
        to: toDate,
      }
    }
  }))
}

export function* historyObservationSaga() {
  //todo: update history  when viewed again?
  yield call(console.log, 'Viewed history again');
}

export function* historyAdjustmentSaga({payload: {from, to}}) {
  yield call(console.log, `Bro you adjusted history from ${from} to ${to}`);
  const historyState : HistoryState = yield select(selectHistoryState);
  const fullHistoryRange = historyState.fullHistoryRange;
  if(from > fullHistoryRange.from && to < fullHistoryRange.to){
    const newFrom = Math.abs(binarySearch(historyState.fullFeed, (activity: Activity)=> {
      return from - activity.antecedenceTime
    }));
    const newTo = Math.abs(binarySearch(historyState.fullFeed, (activity: Activity)=> {
      return to - activity.antecedenceTime
    }));
    console.log("I found dis", newFrom, newTo, historyState.fullFeed.length);
  } else {
    console.log("Great now I actually have to do something");
  }

}
