import {CREATED, DELETED, UPDATED} from "../events/ActivityEvents";

export const ActivityType = {
  ACTIVE: 'ACTIVE',
  PASSIVE: 'PASSIVE',
};
export const ActivityStrategy = {
  GENERIC: 'GENERIC',
};
export const ActivityTimedType = {
  NONE: 'NONE',
  TIMER: 'TIMER',
  STOP_WATCH: 'STOP_WATCH',
};
export type ActivityContent = {
  uuid: string,
  name: string,
  timedType: ActivityTimedType,
  type: ActivityType,
};
export type Activity = {
  antecedenceTime: number,
  content: ActivityContent,
};

export type CachedActivity = {
  uploadType: CREATED | UPDATED | DELETED,
  activity: Activity
};
export type ActivityRegistryFailure = {
  error: any,
  activity: Activity,
}

const getActivityContent = (activity: Activity): ActivityContent => (activity && activity.content) || {};
export const getTimedType = (activity: Activity) => getActivityContent(activity).timedType || ActivityTimedType.NONE;
export const getActivityType = (activity: Activity) => getActivityContent(activity).type || ActivityType.PASSIVE;
export const getActivityName = (activity: Activity) => getActivityContent(activity).name;
export const getActivityObjectiveID = (activity: Activity) => getActivityContent(activity).objectiveID || ActivityStrategy.GENERIC;
export const getActivityID = (activity: Activity) => getActivityContent(activity).activityID || ActivityStrategy.GENERIC;
const getId = (activity: Activity) => getActivityContent(activity).uuid;

export const activitiesEqual = (currentActivity: Activity, activity: Activity) => {
  const activityOneId = getId(currentActivity);
  return activityOneId === getId(activity) && !!activityOneId;
};


export const RECOVERY = 'RECOVERY';
export const isActivityRecovery = (activity: Activity) => activity && activity.content && activity.content.name === RECOVERY;
