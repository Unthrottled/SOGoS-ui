import type {Activity} from "../types/ActivityModels";

export const RECEIVED_HISTORY: 'RECEIVED_HISTORY' = 'RECEIVED_HISTORY';
export const VIEWED_HISTORY: 'VIEWED_HISTORY' = 'VIEWED_HISTORY';
export const ADJUSTED_HISTORY: 'ADJUSTED_HISTORY' = 'ADJUSTED_HISTORY';

export const createViewedHistoryEvent = () => ({
  type: VIEWED_HISTORY,
});

export const createReceivedHistoryEvent = (pastActivities: Activity[]) => ({
  type: RECEIVED_HISTORY,
  payload: pastActivities,
});

export const createAdjustedHistoryTimeFrame = (from: number, to: number) => ({
  type: ADJUSTED_HISTORY,
  payload: {
    from,
    to
  }
});

