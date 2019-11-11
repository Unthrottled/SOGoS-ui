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
  paused: boolean,
  autoStart: boolean,
  veryFirstActivity?: boolean,
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

export const getActivityContent = (activity: Activity): ActivityContent => (activity && activity.content) || {};
export const getTimedType = (activity: Activity) => getActivityContent(activity).timedType || ActivityTimedType.NONE;
export const getActivityType = (activity: Activity) => getActivityContent(activity).type || ActivityType.PASSIVE;
export const getActivityName = (activity: Activity) => getActivityContent(activity).name;
export const isPausedActivity = (activity: Activity) => getActivityContent(activity).paused;
export const getActivityID = (activity: Activity) =>
  getActivityContent(activity).activityID ||
  (isActivityRecovery(activity) && RECOVERY) ||
  ActivityStrategy.GENERIC;
const getId = (activity: Activity) => getActivityContent(activity).uuid;

export const activitiesEqual = (currentActivity: Activity, activity: Activity) => {
  const activityOneId = getId(currentActivity);
  return activityOneId === getId(activity) && !!activityOneId;
};


export const RECOVERY = 'RECOVERY';
export const isActivityRecovery = (activity: Activity) =>
  activity && activity.content && activity.content.name === RECOVERY;
