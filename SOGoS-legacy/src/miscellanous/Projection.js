import type {Activity} from "../types/ActivityModels";
import {ActivityStrategy, getActivityID, getActivityName, isActivityRecovery, RECOVERY} from "../types/ActivityModels";
import {LOGGED_OFF, LOGGED_ON} from "../events/SecurityEvents";


export const haveSameDefaultName = (currentActivity, nextActivity) => {
  const activityName = getActivityName(currentActivity);
  const haveSameName = activityName === getActivityName(nextActivity);
  return haveSameName &&
    (activityName === RECOVERY || activityName === ActivityStrategy.GENERIC);
};

export const haveSameDefinedId = (currentActivity, nextActivity) => {
  const currentActivityIdentifier = getActivityIdentifier(currentActivity);
  const haveSameId = currentActivityIdentifier === getActivityIdentifier(nextActivity);
  return haveSameId && !!currentActivityIdentifier;
};

export const areDifferent = (currentActivity, nextActivity) => {
  return !(haveSameDefinedId(currentActivity, nextActivity) ||
    haveSameDefaultName(currentActivity, nextActivity));
};

export const shouldTime = (activity: Activity) => {
  const activityName = getActivityName(activity);
  switch (activityName) {
    case LOGGED_ON:
    case LOGGED_OFF:
      return false;
    default:
      return true;

  }
};

export const getActivityIdentifier = currentActivity => isActivityRecovery(currentActivity) ? RECOVERY : getActivityID(currentActivity);
