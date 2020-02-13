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
import moment from 'moment';

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
      const startTime = moment.unix(projection.start / 1000);
      const stopTime = moment.unix(projection.stop / 1000);
      const dataPoints =
        Math.floor((projection.stop - projection.start) / stepSize) + 1;
      console.log(`
        from ${startTime.toISOString()} to 
        ${stopTime.toISOString()} is ${dataPoints} points. moment: ${moment
        .duration(stopTime.diff(startTime))
        .asHours().toFixed(4)}
      `);
      return Array(dataPoints)
        .fill(0)
        .map((_, index) => ({
          timeStamp: projection.start + stepSize * index,
          spawn: projection.spawn,
        }));
    })
    .reduce((accum, a) => accum.concat(a), []);
