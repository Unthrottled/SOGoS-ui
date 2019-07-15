import {Action} from "redux";
import {RESUMED_NON_TIMED_ACTIVITY, RESUMED_TIMED_ACTIVITY, STARTED_ACTIVITY} from "../events/ActivityEvents";
import {RECEIVED_HISTORY} from "../events/HistoryEvents";

export type HistoryState = {
  activityFeed: any[],
}

export const INITIAL_HISTORY_STATE: HistoryState = {
  activityFeed: [],
};

const HistoryReducer = (state: HistoryState = INITIAL_HISTORY_STATE, action: Action = {}) => {
  switch (action.type) {
    case RECEIVED_HISTORY:
      return {
        ...state,
        activityFeed: [
          ...action.payload,
          ...state.activityFeed,
        ]
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
