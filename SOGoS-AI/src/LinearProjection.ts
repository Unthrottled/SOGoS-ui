import {Activity, DEFAULT_ACTIVITY, getActivityName} from "../../SOGoS-Next-Gen/src/types/ActivityTypes";
import {areDifferent, getActivityIdentifier, shouldTime} from "../../SOGoS-Next-Gen/src/miscellanous/Projection";
import {ActivityProjection, TimelineProjection} from "../../SOGoS-Next-Gen/src/views/history/Projections";
// @ts-ignore
import reduceRight from "lodash/reduceRight";

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
