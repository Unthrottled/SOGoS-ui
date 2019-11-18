import {Activity, DEFAULT_ACTIVITY, getActivityName} from "../../SOGoS-UI/src/types/ActivityTypes";
import {ActivityProjection} from "../../SOGoS-UI/src/views/history/Projections";
import {areDifferent, getActivityIdentifier, shouldTime} from "../../SOGoS-UI/src/miscellanous/Projection";
import reduceRight = require("lodash/reduceRight");

export interface LinearProjection {
  currentActivity: Activity,
  activityBins: ActivityProjection[],
}
export const constructLinearProjection = (modifiedFeed: Activity[]): LinearProjection =>
  reduceRight(modifiedFeed, (accum: LinearProjection, activity) => {
  if (shouldTime(activity) && !accum.currentActivity.antecedenceTime) {
    accum.currentActivity = activity;
  } else if (areDifferent(accum.currentActivity, activity) && shouldTime(activity)) {
    // Different Type: Create workable chunk and start next activity.
    const currentActivity = accum.currentActivity;
    accum.currentActivity = activity;

    const activityName = getActivityName(currentActivity);
    const activityIdentifier = getActivityIdentifier(currentActivity);
    accum.activityBins.push({
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
  activityBins: [],
});
