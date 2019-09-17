import {call, put, select} from 'redux-saga/effects'
import {performStreamedGet} from "../APISagas";
import {
  createInitializedHistoryEvent,
  createUpdatedFullFeedEvent,
  createUpdatedHistorySelectionEvent
} from "../../events/HistoryEvents";
import {createShowWarningNotificationEvent} from "../../events/MiscEvents";
import {selectHistoryState, selectUserState} from "../../reducers";
import type {HistoryState} from "../../reducers/HistoryReducer";
import {binarySearch} from "../../miscellanous/Tools";
import type {Activity} from "../../types/ActivityModels";
import type {UserState} from "../../reducers/UserReducer";

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
    yield put(createShowWarningNotificationEvent("Unable to get activity history! Try again later, please."));
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
      between: {
        from: meowMinusSeven.valueOf(),
        to: meow.valueOf(),
      }
    },
    full: {
      activities: initialHistoryFeed,
      between: {
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
  const fullHistoryFeed = yield call(getOrUpdateFullFeed, to, from);
  yield call(updateSelection, fullHistoryFeed, to, from);
}

export function* getOrUpdateFullFeed(to: number, from: number): Activity[] {
  const historyState: HistoryState = yield select(selectHistoryState);
  const fullHistoryRange = historyState.fullHistoryRange;
  if (from > fullHistoryRange.from && to < fullHistoryRange.to) {
    return historyState.fullFeed;
  } else {
    console.log("Great now I actually have to do something");
    return yield call(updateFullFeed, to, from);
  }
}

export function* updateFullFeed(to: number, from: number): Activity[] {
  const historyState: HistoryState = yield select(selectHistoryState);
  const userState: UserState = yield select(selectUserState);
  const fullHistoryRange = historyState.fullHistoryRange;
  if(from < fullHistoryRange.from && to <= fullHistoryRange.to){
    const olderHistory = yield call(archiveFetchSaga, userState.information.guid, from, fullHistoryRange.from);
    const updatedHistory = historyState.fullFeed.concat(olderHistory);
    yield put(createUpdatedFullFeedEvent({
      activities: updatedHistory,
      between: {
        from,
        to: fullHistoryRange.to,
      }
    }));
    return updatedHistory;
  } else if (from >= fullHistoryRange.from && to > fullHistoryRange.to){
    const newerHistory = yield call(archiveFetchSaga, userState.information.guid, fullHistoryRange.to, to);
    const updatedHistory = newerHistory.concat(historyState.fullFeed);
    yield put(createUpdatedFullFeedEvent({
      activities: updatedHistory,
      between: {
        from: fullHistoryRange.from,
        to,
      }
    }));
    return updatedHistory;
  } else {
    const olderHistory = yield call(archiveFetchSaga, userState.information.guid, from, fullHistoryRange.from);
    const newerHistory = yield call(archiveFetchSaga, userState.information.guid, fullHistoryRange.to, to);
    const updatedHistory = newerHistory.concat(historyState.fullFeed).concat(olderHistory);
    yield put(createUpdatedFullFeedEvent({
      activities: updatedHistory,
      between: {
        from,
        to,
      }
    }));
    return updatedHistory;
  }
}

export function* updateSelection(fullFeed: Activity[], to: number, from: number) {
  const newFrom = Math.abs(binarySearch(fullFeed, (activity: Activity) => {
    return from - activity.antecedenceTime
  }));
  const safeFrom = newFrom >= fullFeed.length ? fullFeed.length : newFrom + 1;
  const newTo = Math.abs(binarySearch(fullFeed, (activity: Activity) => {
    return to - activity.antecedenceTime
  }));
  yield put(createUpdatedHistorySelectionEvent({
    between: {
      from,
      to
    },
    activities: fullFeed.slice(newTo, safeFrom)
  }))
}
