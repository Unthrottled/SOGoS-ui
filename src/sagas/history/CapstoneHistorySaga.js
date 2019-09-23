import {call, select, take} from 'redux-saga/effects';
import type {DateRange, HistoryState} from "../../reducers/HistoryReducer";
import {selectHistoryState} from "../../reducers";
import {UPDATED_FULL_FEED} from "../../events/HistoryEvents";
import type {Activity} from "../../types/ActivityModels";

export type FullRangeAndFeed = {
  activities: Activity[],
  timeRange: DateRange,
}

export function* capstoneHistorySaga(fullRangeAndFeed: FullRangeAndFeed) {
  const firstBefore: Activity = yield call(getFirstBefore, fullRangeAndFeed);
  const firstAfter: Activity = yield call(getFirstBefore, fullRangeAndFeed);
  console.log(firstBefore, firstAfter);

  // update state with first before and after
}

export function* getFirstBefore(fullRangeAndFeed: FullRangeAndFeed) {

}

export function* getFirstAfter(fullRangeAndFeed: FullRangeAndFeed) {

}

export function* getFullHistory(timeRange: DateRange): FullRangeAndFeed {
  const historyState: HistoryState = yield select(selectHistoryState);
  const {fullHistoryRange} = historyState;
  if (fullHistoryRange.to < timeRange.to || fullHistoryRange.from > timeRange.from) {
    return yield take(UPDATED_FULL_FEED);
  } else {
    return {
      activities: historyState.fullFeed,
      timeRange: historyState.fullHistoryRange,
    }
  }
}
