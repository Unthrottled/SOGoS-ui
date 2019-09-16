import type {Activity} from "../types/ActivityModels";
import type {DateRange} from "../reducers/HistoryReducer";

export const INITIALIZED_HISTORY: 'INITIALIZED_HISTORY' = 'INITIALIZED_HISTORY';
export const VIEWED_HISTORY: 'VIEWED_HISTORY' = 'VIEWED_HISTORY';
export const ADJUSTED_HISTORY: 'ADJUSTED_HISTORY' = 'ADJUSTED_HISTORY';

export const createViewedHistoryEvent = () => ({
  type: VIEWED_HISTORY,
});

export type ActivityReceptionPayload = {
  activities: Activity[],
  between: DateRange,
}

export const createInitializedHistoryEvent = (activityReception: ActivityReceptionPayload) => ({
  type: INITIALIZED_HISTORY,
  payload: activityReception,
});

export const createAdjustedHistoryTimeFrame = (from: number, to: number) => ({
  type: ADJUSTED_HISTORY,
  payload: {
    from,
    to
  }
});

