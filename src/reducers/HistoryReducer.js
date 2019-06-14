import {Action} from "redux";

export type HistoryState = {
  activityFeed: any[],
}

const INITIAL_HISTORY_STATE: HistoryState = {
  activityFeed: [],
};


const HistoryReducer = (state: HistoryState = INITIAL_HISTORY_STATE, action: Action) => {
  switch (action.type) {
    default:
      return state
  }
};

export default HistoryReducer;
