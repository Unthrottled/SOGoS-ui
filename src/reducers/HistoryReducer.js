import {Action} from "redux";
import {STARTED_ACTIVITY} from "../events/ActivityEvents";
import {RECEIVED_HISTORY} from "../events/HistoryEvents";

export type HistoryState = {
  activityFeed: any[],
}

const INITIAL_HISTORY_STATE: HistoryState = {
  activityFeed: [],
};


const HistoryReducer = (state: HistoryState = INITIAL_HISTORY_STATE, action: Action) => {
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
