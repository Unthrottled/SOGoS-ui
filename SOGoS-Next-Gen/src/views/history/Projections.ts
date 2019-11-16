import {Activity, DEFAULT_ACTIVITY, getActivityName} from "../../types/ActivityTypes";
import reduceRight from "lodash/reduceRight";
import {areDifferent, getActivityIdentifier, shouldTime} from "../../miscellanous/Projection";
import {StringDictionary} from "../../types/BaseTypes";

export interface ActivityProjection {
  activityName: string,
  activityIdentifier: string,
  start: number,
  stop: number,
  spawn: {
    start: Activity,
    stop: Activity
  },
  lane?: number,
}

export interface TimelineProjection {
  currentActivity: Activity,
  activityBins: StringDictionary<ActivityProjection[]>,
}

export const constructProjection = (modifiedFeed: Activity[]) => reduceRight(modifiedFeed, (accum: TimelineProjection, activity) => {
  if (shouldTime(activity) && !accum.currentActivity.antecedenceTime) {
    accum.currentActivity = activity;
  } else if (areDifferent(accum.currentActivity, activity) && shouldTime(activity)) {
    // Different Type: Create workable chunk and start next activity.
    const currentActivity = accum.currentActivity;
    accum.currentActivity = activity;

    const activityName = getActivityName(currentActivity);
    const activityIdentifier = getActivityIdentifier(currentActivity);
    if (!accum.activityBins[activityIdentifier]) {
      accum.activityBins[activityIdentifier] = [];
    }
    accum.activityBins[activityIdentifier].push({
      activityName,
      activityIdentifier,
      start: currentActivity.antecedenceTime,
      stop: activity.antecedenceTime,
      spawn: {
        start: currentActivity,
        stop: activity
      },
    });
  }
  return accum;
}, {
  currentActivity: DEFAULT_ACTIVITY,
  activityBins: {}
});
