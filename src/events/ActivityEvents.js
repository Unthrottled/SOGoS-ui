export const STARTED_ACTIVITY = 'STARTED_ACTIVITY';
export const CACHED_ACTIVITY = 'CACHED_ACTIVITY';
export const SYNCED_ACTIVITIES = 'SYNCED_ACTIVITIES';
export const STARTED_TIMED_ACTIVITY = 'STARTED_TIMED_ACTIVITY';
export const STARTED_NON_TIMED_ACTIVITY = 'STARTED_NON_TIMED_ACTIVITY';
export const RESUMED_TIMED_ACTIVITY = 'RESUMED_TIMED_ACTIVITY';
export const RESUMED_NON_TIMED_ACTIVITY = 'RESUMED_NON_TIMED_ACTIVITY';
export const REGISTERED_ACTIVITY_START = 'REGISTERED_ACTIVITY_START';
export const FAILED_TO_REGISTER_ACTIVITY_START = 'FAILED_TO_REGISTER_ACTIVITY_START';

export type ActivityContent = {
  uuid: string,
  name: string,
}

export const ActivityType = {
  ACTIVE: 'ACTIVE',
  PASSIVE: 'PASSIVE',
};

export const ActivityTimedType = {
  NONE: 'NONE',
  TIMER: 'TIMER',
  STOP_WATCH: 'STOP_WATCH',
};

export type Activity = {
  antecedenceTime: number,
  content: ActivityContent,
};

export type ActivityCacheEvent = {
  activity: Activity,
  userGUID: string,
};


export const createStartedActivityEvent = (content: ActivityContent) => ({
  type: STARTED_ACTIVITY,
  payload: {
    antecedenceTime: new Date().getTime(),
    content
  }
});

export const createStartedTimedActivityEvent = (content: ActivityContent) => ({
  type: STARTED_TIMED_ACTIVITY,
  payload: {
    antecedenceTime: new Date().getTime(),
    content
  }
});

export const createStartedNonTimedActivityEvent = (content: ActivityContent) => ({
  type: STARTED_NON_TIMED_ACTIVITY,
  payload: {
    antecedenceTime: new Date().getTime(),
    content,
    timedType: ActivityTimedType.NONE,
  }
});

export const createResumedStartedTimedActivityEvent = (activity: Activity) => ({
  type: RESUMED_TIMED_ACTIVITY,
  payload: activity
});

export const createResumedStartedNonTimedActivityEvent = (activity: Activity) => ({
  type: RESUMED_NON_TIMED_ACTIVITY,
  payload: activity
});

export const createCachedActivityEvent = (activity: ActivityCacheEvent) => ({
  type: CACHED_ACTIVITY,
  payload: activity
});

export const createSyncedActivitiesEvent = (userGUID: string) => ({
  type: SYNCED_ACTIVITIES,
  payload: userGUID,
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
