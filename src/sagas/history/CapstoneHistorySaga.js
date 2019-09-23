import {call, select, take} from 'redux-saga/effects';
import type {DateRange, HistoryState} from "../../reducers/HistoryReducer";
import {selectHistoryState} from "../../reducers";
import {UPDATED_FULL_FEED} from "../../events/HistoryEvents";
import type {Activity} from "../../types/ActivityModels";
import {reverseBinarySearch} from "../../miscellanous/Tools";

export type FullRangeAndFeed = {
  activities: Activity[],
  timeRange: DateRange,
}

export function* capstoneHistorySaga(selectedDateRange: DateRange,
                                     fullRangeAndFeed: FullRangeAndFeed) {
  const firstBefore: Activity = yield call(getFirstBefore, selectedDateRange.from, fullRangeAndFeed);
  const firstAfter: Activity = yield call(getFirstAfter, selectedDateRange.to, fullRangeAndFeed);
  console.log("New capstones", firstBefore, firstAfter);
  // update state with first before and after
}

export function* getFirstBefore(selectedFromDate: number,
                                {activities, timeRange: {from, to}}: FullRangeAndFeed) {
  const activityIndex = reverseBinarySearch(activities,
    (activity: Activity) => activity.antecedenceTime - selectedFromDate);
  if (activityIndex < 0 && (activityIndex === -1 || activityIndex === -(activityIndex.length + 1))) {
    console.log("great I gotta talk to the API, with the from date as a parameter");
  } else {
    console.log("Looks Like I can do stuff with what I got");
  }
}

export function* getFirstAfter(selectedToRange: number,
                               {activities, timeRange: {from, to}}: FullRangeAndFeed) {
  const activityIndex = reverseBinarySearch(activities,
    (activity: Activity) => activity.antecedenceTime - selectedToRange);
  if (activityIndex < 0 && (activityIndex === -1 || activityIndex === -(activityIndex.length + 1))) {
    console.log("great I gotta talk to the API, with the to date as a parameter");
  } else {
    console.log("Looks Like I can do stuff with what I got");
  }
}

export function* getFullHistory(timeRange: DateRange): FullRangeAndFeed {
  const historyState: HistoryState = yield select(selectHistoryState);
  const {fullHistoryRange} = historyState;
  if (fullHistoryRange.to < timeRange.to || fullHistoryRange.from > timeRange.from) {
    const {payload} = yield take(UPDATED_FULL_FEED);
    return {
      timeRange: payload.between,
      activities: payload.activities,
    };
  } else {
    return {
      activities: historyState.fullFeed,
      timeRange: historyState.fullHistoryRange,
    }
  }
}
