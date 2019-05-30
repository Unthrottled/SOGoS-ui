export const STARTED_ACTIVITY = 'STARTED_ACTIVITY';
export const REGISTERED_ACTIVITY_START = 'REGISTERED_ACTIVITY_START';
export const FAILED_TO_REGISTER_ACTIVITY_START = 'FAILED_TO_REGISTER_ACTIVITY_START';

export type Activity = {
  antecedenceTime: number,
  content: {
    id: string
  },
};

export const createStartedActivityEvent = (activity: Activity) => ({
  type: STARTED_ACTIVITY,
  payload: activity
});

export const createRegisteredStartEvent = (activity: Activity) => ({
  type: REGISTERED_ACTIVITY_START,
  payload: activity
});

export type ActivityRegistryFailure = {
  error: any,
  activity: Activity,
}

export const createFailureToRegisterStartEvent = (activityRegistryFailure: ActivityRegistryFailure) => ({
  type: FAILED_TO_REGISTER_ACTIVITY_START,
  payload: activityRegistryFailure
});
