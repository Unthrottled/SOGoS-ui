import type {Activity} from "../types/ActivityModels";
import type {DateRange} from "../reducers/HistoryReducer";

export const RECEIVED_HISTORY: 'RECEIVED_HISTORY' = 'RECEIVED_HISTORY';
export const VIEWED_HISTORY: 'VIEWED_HISTORY' = 'VIEWED_HISTORY';
export const ADJUSTED_HISTORY: 'ADJUSTED_HISTORY' = 'ADJUSTED_HISTORY';

export const createViewedHistoryEvent = () => ({
  type: VIEWED_HISTORY,
});

export type ActivityReceptionPayload = {
  activities: Activity[],
  between: DateRange,
}

export const createReceivedHistoryEvent = (activityReception: ActivityReceptionPayload) => ({
  type: RECEIVED_HISTORY,
  payload: activityReception,
});

export const createAdjustedHistoryTimeFrame = (from: number, to: number) => ({
  type: ADJUSTED_HISTORY,
  payload: {
    from,
    to
  }
});

