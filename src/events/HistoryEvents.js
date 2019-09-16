import type {Activity} from "../types/ActivityModels";
import type {DateRange} from "../reducers/HistoryReducer";

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

export const createInitializedHistoryEvent = (activityReception: ActivityReceptionPayload) => ({
  type: INITIALIZED_HISTORY,
  payload: activityReception,
});

export const createUpdatedHistoryEvent = (activityUpdate: ActivityUpdatePayload) => ({
  type: UPDATED_HISTORY,
  payload: activityUpdate,
});

export const createAdjustedHistoryTimeFrame = (from: number, to: number) => ({
  type: ADJUSTED_HISTORY,
  payload: {
    from,
    to
  }
});

