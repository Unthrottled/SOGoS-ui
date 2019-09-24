import {call, select, take} from 'redux-saga/effects';
import type {DateRange, HistoryState} from "../../reducers/HistoryReducer";
import {selectHistoryState, selectUserState} from "../../reducers";
import {UPDATED_FULL_FEED} from "../../events/HistoryEvents";
import type {Activity} from "../../types/ActivityModels";
import {reverseBinarySearch} from "../../miscellanous/Tools";
import type {UserState} from "../../reducers/UserReducer";
import {performPost} from "../APISagas";

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
  // update range
}

export function* getFirstBefore(selectedFromDate: number,
                                {activities, timeRange: {from, to}}: FullRangeAndFeed) {
  const activityIndex = reverseBinarySearch(activities,
    (activity: Activity) => activity.antecedenceTime - selectedFromDate);
  if (activityIndex < 0 && (activityIndex === -1 || activityIndex === -(activityIndex.length + 1))) {
    console.log("great I gotta talk to the API, with the from date as a parameter");
    // Take oldest item
    const oldestTime = activities.length ? activities[activities.length - 1].antecedenceTime : from;
    const {data} = yield call(findFirstActivityBeforeTime, oldestTime);
    if(data) {
      return data
    }
  }
  console.log("Looks Like I can do stuff with what I got");
  return activities[activities.length - 1];
}

export const constructActivityBeforeURL = (guid: string) => `/api/history/${guid}/first/before`;

export const constructActivityAfterURL = (guid: string) => `/api/history/${guid}/first/after`;

export function* findFirstActivityBeforeTime(relativeTime: number): Activity {
  const {information: {guid}}: UserState = yield select(selectUserState);
  const beforeURL = constructActivityBeforeURL(guid);
  try {
    return yield call(performPost, beforeURL, {relativeTime});
  } catch (e) {
    return undefined
  }
}

export function* getFirstAfter(selectedToRange: number,
                               {activities, timeRange: {from, to}}: FullRangeAndFeed) {
  const activityIndex = reverseBinarySearch(activities,
    (activity: Activity) => activity.antecedenceTime - selectedToRange);
  if (activityIndex < 0 && (activityIndex === -1 || activityIndex === -(activityIndex.length + 1))) {
    console.log("great I gotta talk to the API, with the to date as a parameter");
    // Take youngest item
    // Get First after
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
