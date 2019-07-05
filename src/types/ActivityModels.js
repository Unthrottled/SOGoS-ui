import {CREATED, DELETED, UPDATED} from "../events/ActivityEvents";

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

export type CachedActivity = {
  uploadType: CREATED | UPDATED | DELETED,
  activity: Activity
};
export type ActivityRegistryFailure = {
  error: any,
  activity: Activity,
}
//todo: wrap activity in Activity function that has methods like deez.
const getActivityContent = (activity: Activity) => activity.content || {};
export const getTimedType = (activity: Activity) => getActivityContent(activity).timedType || ActivityTimedType.NONE;
export const getActivityType = (activity: Activity) => getActivityContent(activity).type || ActivityType.PASSIVE;
const getId = (activity: Activity) => getActivityContent(activity).uuid;

export const activitiesEqual = (currentActivity: Activity, activity: Activity) => {
  const activityOneId = getId(currentActivity);
  return activityOneId === getId(activity) && !!activityOneId;
};
