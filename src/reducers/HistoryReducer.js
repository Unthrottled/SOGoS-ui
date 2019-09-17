import {Action} from "redux";
import {RESUMED_NON_TIMED_ACTIVITY, RESUMED_TIMED_ACTIVITY, STARTED_ACTIVITY} from "../events/ActivityEvents";
import {INITIALIZED_HISTORY, UPDATED_HISTORY, UPDATED_HISTORY_SELECTION} from "../events/HistoryEvents";
import type {ActivityReceptionPayload, ActivityUpdatePayload} from "../events/HistoryEvents";

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

const DEFAULT_RANGE: DateRange = {
  from: 0,
  to: 0,
};

export const INITIAL_HISTORY_STATE: HistoryState = {
  activityFeed: [],
  fullFeed: [],
  selectedHistoryRange: DEFAULT_RANGE,
  fullHistoryRange: DEFAULT_RANGE,
};

const HistoryReducer = (state: HistoryState = INITIAL_HISTORY_STATE, action: Action = {}): HistoryState => {
  switch (action.type) {
    case INITIALIZED_HISTORY:
    case UPDATED_HISTORY:
      const payload: ActivityUpdatePayload = action.payload;
      return {
        ...state,
        activityFeed: payload.selection.activities,
        selectedHistoryRange: payload.selection.between,
        fullFeed: payload.full.activities,
        fullHistoryRange: payload.full.between,
      };
    case UPDATED_HISTORY_SELECTION:
      const newSelectionPayload: ActivityReceptionPayload = action.payload;
      return {
        ...state,
        selectedHistoryRange: newSelectionPayload.between,
        activityFeed: newSelectionPayload.activities,
      }
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
