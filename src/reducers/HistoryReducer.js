import {Action} from "redux";
import {RESUMED_NON_TIMED_ACTIVITY, RESUMED_TIMED_ACTIVITY, STARTED_ACTIVITY} from "../events/ActivityEvents";
import {INITIALIZED_HISTORY} from "../events/HistoryEvents";
import type {ActivityReceptionPayload} from "../events/HistoryEvents";

export type DateRange = {
  from: number,
  to: number,
}

export type HistoryState = {
  activityFeed: any[],
  selectedHistoryRange: DateRange,
  fullFeed: any[],
  fullHistoryRange: DateRange
}

export const INITIAL_HISTORY_STATE: HistoryState = {
  activityFeed: [],
  fullFeed: [],
};

const HistoryReducer = (state: HistoryState = INITIAL_HISTORY_STATE, action: Action = {}): HistoryState => {
  switch (action.type) {
    case INITIALIZED_HISTORY:
      const payload: ActivityReceptionPayload = action.payload;
      return {
        ...state,
        activityFeed: [
          ...payload.activities,
          ...state.activityFeed,
        ],
        fullFeed: [
          ...payload.activities,
          ...state.fullFeed,
        ],
        selectedHistoryRange: payload.between,
        fullHistoryRange: payload.between,
      };

    case STARTED_ACTIVITY:
    case RESUMED_TIMED_ACTIVITY :
    case RESUMED_NON_TIMED_ACTIVITY :
      return {
        ...state,
        activityFeed: [
          action.payload,
          ...state.activityFeed,
        ]
      };
    default:
      return state
  }
};

export default HistoryReducer;
