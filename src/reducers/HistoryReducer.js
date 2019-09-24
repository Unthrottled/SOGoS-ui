import {Action} from "redux";
import type {ActivityReceptionPayload, ActivityUpdatePayload} from "../events/HistoryEvents";
import {
  INITIALIZED_HISTORY,
  UPDATED_FULL_FEED,
  UPDATED_HISTORY,
  UPDATED_HISTORY_SELECTION
} from "../events/HistoryEvents";
import type {Activity} from "../types/ActivityModels";

export type DateRange = {
  from: number,
  to: number,
}

export type CapstoneState = {
  topActivity: Activity,
  bottomActivity: Activity,
};

export type HistoryState = {
  activityFeed: any[],
  selectedHistoryRange: DateRange,
  fullFeed: any[],
  fullHistoryRange: DateRange,
  capstone: CapstoneState,
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
    case UPDATED_FULL_FEED:
      const newFullFeedPayload: ActivityReceptionPayload = action.payload;
      return {
        ...state,
        fullHistoryRange: newFullFeedPayload.between,
        fullFeed: newFullFeedPayload.activities,
      };
    case UPDATED_HISTORY_SELECTION:
      const newSelectionPayload: ActivityReceptionPayload = action.payload;
      return {
        ...state,
        selectedHistoryRange: newSelectionPayload.between,
        activityFeed: newSelectionPayload.activities,
      };
    default:
      return state
  }
};

export default HistoryReducer;
