export const STARTED_ACTIVITY = 'STARTED_ACTIVITY';
export const REGISTERED_ACTIVITY_START = 'REGISTERED_ACTIVITY_START';
export const FAILED_TO_REGISTER_ACTIVITY_START = 'FAILED_TO_REGISTER_ACTIVITY_START';

export type ActivityContent = {
  id: string,
  name: string,
}

export type Activity = {
  antecedenceTime: number,
  content: ActivityContent,
};

export const createStartedActivityEvent = (content: ActivityContent) => ({
  type: STARTED_ACTIVITY,
  payload: {
    antecedenceTime: new Date().getTime(),
    content
  }
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
