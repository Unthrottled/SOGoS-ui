import type {Activity} from "../types/ActivityModels";
import type {DateRange} from "../reducers/HistoryReducer";

export const UPDATED_HISTORY_SELECTION: 'UPDATED_HISTORY_SELECTION' = 'UPDATED_HISTORY_SELECTION';
export const INITIALIZED_HISTORY: 'INITIALIZED_HISTORY' = 'INITIALIZED_HISTORY';
export const UPDATED_HISTORY: 'UPDATED_HISTORY' = 'UPDATED_HISTORY';
export const VIEWED_HISTORY: 'VIEWED_HISTORY' = 'VIEWED_HISTORY';
export const ADJUSTED_HISTORY: 'ADJUSTED_HISTORY' = 'ADJUSTED_HISTORY';

export const createViewedHistoryEvent = () => ({
  type: VIEWED_HISTORY,
});

export type ActivityReceptionPayload = {
  activities: Activity[],
  between: DateRange,
}

export type ActivityUpdatePayload = {
  selection : ActivityReceptionPayload,
  full: ActivityReceptionPayload,
}

export const createInitializedHistoryEvent = (activityUpdate: ActivityUpdatePayload) => ({
  type: INITIALIZED_HISTORY,
  payload: activityUpdate,
});

export const createUpdatedHistoryEvent = (activityUpdate: ActivityUpdatePayload) => ({
  type: UPDATED_HISTORY,
  payload: activityUpdate,
});

export const createUpdatedHistorySelectionEvent = (activityUpdate: ActivityReceptionPayload) => ({
  type: UPDATED_HISTORY_SELECTION,
  payload: activityUpdate,
});

export const createAdjustedHistoryTimeFrame = (from: number, to: number) => ({
  type: ADJUSTED_HISTORY,
  payload: {
    from,
    to
  }
});

