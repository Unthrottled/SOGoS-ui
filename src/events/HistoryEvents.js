import type {Activity} from "./ActivityEvents";

export const RECEIVED_HISTORY: 'RECEIVED_HISTORY' = 'RECEIVED_HISTORY';

export const createReceivedHistoryEvent = (pastActivities: Activity[]) => ({
  type: RECEIVED_HISTORY,
  payload: pastActivities,
});
