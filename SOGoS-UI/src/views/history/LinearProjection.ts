import reduceRight from 'lodash/reduceRight';
import {
  Activity,
  DEFAULT_ACTIVITY,
  getActivityName,
} from '../../types/ActivityTypes';
import {ActivityProjection} from './Projections';
import {
  areDifferent,
  getActivityIdentifier,
  shouldTime,
} from '../../miscellanous/Projection';

export interface LinearProjection {
  currentActivity: Activity;
  activityBins: ActivityProjection[];
}
export const constructLinearProjection = (
  modifiedFeed: Activity[],
): LinearProjection =>
  reduceRight(
    modifiedFeed,
    (accum: LinearProjection, activity) => {
      if (shouldTime(activity) && !accum.currentActivity.antecedenceTime) {
        accum.currentActivity = activity;
      } else if (
        areDifferent(accum.currentActivity, activity) &&
        shouldTime(activity)
      ) {
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
            stop: activity,
          },
        });
      }
      return accum;
    },
    {
      currentActivity: DEFAULT_ACTIVITY,
      activityBins: [],
    },
  );

export const breakIntoSteps = (
  linearProjection: LinearProjection,
  stepSize: number,
) =>
  linearProjection.activityBins
    .map((projection: ActivityProjection) => {
      const dataPoints =
        Math.floor((projection.stop - projection.start) / stepSize) + 1;
      return Array(dataPoints)
        .fill(0)
        .map((_, index) => ({
          timeStamp: projection.start + stepSize * index,
          spawn: projection.spawn,
        }));
    })
    .reduce((accum, a) => accum.concat(a), []);
