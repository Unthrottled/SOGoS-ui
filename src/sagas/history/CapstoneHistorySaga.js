import {put, call, select, take} from 'redux-saga/effects';
import type {DateRange, HistoryState} from "../../reducers/HistoryReducer";
import {selectHistoryState, selectUserState} from "../../reducers";
import {
  createFoundAfterCapstoneEvent,
  createFoundBeforeCapstoneEvent, createUpdatedCapstonesEvent,
  UPDATED_FULL_FEED
} from "../../events/HistoryEvents";
import type {Activity} from "../../types/ActivityModels";
import {reverseBinarySearch} from "../../miscellanous/Tools";
import type {UserState} from "../../reducers/UserReducer";
import {performPost} from "../APISagas";
import {isTimedActivity} from "../activity/CurrentActivitySaga";
import {shouldTime} from "../../miscellanous/Projection";

export type FullRangeAndFeed = {
  activities: Activity[],
  timeRange: DateRange,
}

export function* capstoneHistorySaga(selectedDateRange: DateRange,
                                     fullRangeAndFeed: FullRangeAndFeed) {
  const firstBefore: Activity = yield call(getFirstBefore, selectedDateRange.from, fullRangeAndFeed);
  const historyState: HistoryState = yield select(selectHistoryState);
  const maybeAfter: Activity = yield call(getFirstAfter, selectedDateRange.to, {
    activities: historyState.fullFeed,
    timeRange: historyState.fullHistoryRange,
  });
  const firstAfter: Activity = maybeAfter || firstBefore;
  yield put(createUpdatedCapstonesEvent({
    beforeCapstone: firstBefore,
    afterCapstone: firstAfter,
  }));
}

const getBeforeIndex = (index) => {
  if(index > -1){
    return index + 1;
  } else {
    return Math.abs(index)  
  }
};

//todo: this
const getAfterIndex = (index) => {
  if(index > -1){
    return index - 1;
  } else {
    return Math.abs(index) - 1
  }
};

//look into this behaving badly 09/23/2019 045523a - 09/23/2019 064023a
//with 09/23/2019 044023a - 09/23/2019 064023a (when reducing time of titties)
export function* getFirstBefore(selectedFromDate: number,
                                {activities, timeRange: {from}}: FullRangeAndFeed) {
  const activityIndex = reverseBinarySearch(activities,
    (activity: Activity) => selectedFromDate - activity.antecedenceTime);
  const updatedActivityIndex = getBeforeIndex(activityIndex);
  if (updatedActivityIndex > activities.length - 1) {
    const {data} = yield call(findFirstActivityBeforeTime, from);
    if(data) {
      yield put(createFoundBeforeCapstoneEvent(data));
      return yield findOldestTimedActivity(data)
    }
  }
  return activities[updatedActivityIndex];
}

export function* findOldestTimedActivity(activity: Activity){
  if(shouldTime(activity)){
    return activity;
  } else {
    let currentOldie = activity;
    while (!shouldTime(currentOldie)){
      const {data} = yield call(findFirstActivityBeforeTime, currentOldie.antecedenceTime);
      if(data) {
        yield put(createFoundBeforeCapstoneEvent(data));
        currentOldie = data;
        if(isTimedActivity(data)){
          break
        }
      } else {
        break
      }
    }
    return currentOldie;
  }
}

export function* getFirstAfter(selectedToRange: number,
                               {activities, timeRange: {to}}: FullRangeAndFeed) {
  const activityIndex = reverseBinarySearch(activities,
    (activity: Activity) => selectedToRange - activity.antecedenceTime);
  const updatedActivityIndex = getAfterIndex(activityIndex);
  if (updatedActivityIndex < 0) {
    const {data} = yield call(findFirstActivityAfterTime, to);
    if(data) {
      yield put(createFoundAfterCapstoneEvent(data));
      return data
    }
  }
  return activities[updatedActivityIndex];
}

export const constructActivityBeforeURL = (guid: string) => `/api/history/${guid}/first/before`;

export const constructActivityAfterURL = (guid: string) => `/api/history/${guid}/first/after`;

export function* findFirstActivityBeforeTime(relativeTime: number): Activity {
  return yield call(findCapstoneActivity, relativeTime, constructActivityBeforeURL)
}

export function* findFirstActivityAfterTime(relativeTime: number): Activity {
  return yield call(findCapstoneActivity, relativeTime, constructActivityAfterURL)
}

export function* findCapstoneActivity(relativeTime: number, urlBuilder: (string) => string) : Activity {
  const {information: {guid}}: UserState = yield select(selectUserState);
  const beforeURL = urlBuilder(guid);
  try {
    return yield call(performPost, beforeURL, {relativeTime});
  } catch (e) {
    return {}
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
