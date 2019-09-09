import type {Activity} from "../types/ActivityModels";
import {getActivityName, getActivityObjectiveID, isActivityRecovery, RECOVERY} from "../types/ActivityModels";
import {LOGGED_OFF, LOGGED_ON} from "../events/SecurityEvents";


export const areDifferent = (currentActivity, nextActivity) => true;
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

export const getActivityIdentifier = currentActivity => isActivityRecovery(currentActivity) ? RECOVERY : getActivityObjectiveID(currentActivity);
