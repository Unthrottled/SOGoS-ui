import {Action} from "redux";
import {STARTED_ACTIVITY} from "../events/ActivityEvents";

export type HistoryState = {
  activityFeed: any[],
}

const INITIAL_HISTORY_STATE: HistoryState = {
  activityFeed: [],
};


const HistoryReducer = (state: HistoryState = INITIAL_HISTORY_STATE, action: Action) => {
  switch (action.type) {
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
