import {
  ActivityReceptionPayload,
  ActivityUpdatePayload, ADJUSTED_HISTORY,
  CapstoneActivityUpdatePayload,
  INITIALIZED_HISTORY,
  UPDATED_CAPSTONES,
  UPDATED_FULL_FEED,
  UPDATED_HISTORY,
  UPDATED_HISTORY_SELECTION,
} from '../events/HistoryEvents';
import {Activity} from '../types/ActivityTypes';
import {defaultActivity} from './ActivityReducer';
import {FAILED_TO_RECEIVE_READ_TOKEN} from "../events/SecurityEvents";

export interface DateRange {
  from: number;
  to: number;
}

export interface CapstoneState {
  topActivity: Activity;
  bottomActivity: Activity;
}

export interface HistoryState {
  activityFeed: Activity[];
  selectedHistoryRange: DateRange;
  fullFeed: Activity[];
  fullHistoryRange: DateRange;
  capstone: CapstoneState;
  loading: boolean;
}

const DEFAULT_RANGE: DateRange = {
  from: 0,
  to: 69,
};

export const INITIAL_HISTORY_STATE: HistoryState = {
  activityFeed: [],
  fullFeed: [],
  selectedHistoryRange: DEFAULT_RANGE,
  fullHistoryRange: DEFAULT_RANGE,
  capstone: {
    topActivity: defaultActivity,
    bottomActivity: defaultActivity,
  },
  loading: false,
};

const HistoryReducer = (
  state: HistoryState = INITIAL_HISTORY_STATE,
  action: any,
): HistoryState => {
  switch (action.type) {
    case FAILED_TO_RECEIVE_READ_TOKEN:
      return INITIAL_HISTORY_STATE;
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
    case ADJUSTED_HISTORY:
      return {
        ...state,
        loading: true,
      };
    case UPDATED_CAPSTONES:
      const newCapstones: CapstoneActivityUpdatePayload = action.payload;
      return {
        ...state,
        loading: false,
        capstone: {
          topActivity: newCapstones.afterCapstone,
          bottomActivity: newCapstones.beforeCapstone,
        },
      };
    default:
      return state;
  }
};

export default HistoryReducer;
