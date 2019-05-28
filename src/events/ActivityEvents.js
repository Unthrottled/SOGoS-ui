export const STARTED_ACTIVITY = 'STARTED_ACTIVITY';

export type Activity = {
  antecedenceTime: number,
};

export const createStartedActivityEvent = (activity: Activity) => ({
  type: STARTED_ACTIVITY,
  payload: activity
});
