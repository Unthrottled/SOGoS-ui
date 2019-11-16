import * as React from 'react';
import {FC, useEffect} from 'react';
import {select} from 'd3-selection';
import {arc, pie} from 'd3'
import {connect} from "react-redux";
import {GlobalState, selectHistoryState, selectTacticalActivityState} from "../../reducers";
import {numberObjectToArray, objectToKeyValueArray} from "../../miscellanous/Tools";
import {areDifferent, getActivityIdentifier, shouldTime} from "../../miscellanous/Projection";
import {constructColorMappings} from "./TimeLine";
import {dictionaryReducer} from "../../reducers/StrategyReducer";
import {TacticalActivity} from "../../types/TacticalTypes";
import {HasId, NumberDictionary, StringDictionary} from "../../types/BaseTypes";
import {activitiesEqual, Activity, DEFAULT_ACTIVITY, getActivityName} from "../../types/ActivityTypes";
import reduceRight from 'lodash/reduceRight';

export const getMeaningFullName = (activityId: string, tacticalActivities: StringDictionary<TacticalActivity>) => {
  const tacticalActivity: TacticalActivity = tacticalActivities[activityId];
  return (tacticalActivity && tacticalActivity.name) || activityId
};

export const responsivefy = (svg: any) => {
  const container = select(svg.node().parentNode),
    width = parseInt(svg.style("width")),
    height = parseInt(svg.style("height")),
    aspect = width / height;
  svg
    .attr("perserveAspectRatio", "xMinYMid")
    .call(resize);

  select(window).on("resize." + container.attr("id"), resize);

  function resize() {
    const targetWidth = parseInt(container.style("width"));
    svg.attr("width", targetWidth);
    const heightBoi = Math.round(targetWidth / aspect);
    svg.attr("height", heightBoi);
  }
};

export const mapTacticalActivitiesToID = <T extends HasId>(tacticalActivities: NumberDictionary<T>): StringDictionary<T> =>
  numberObjectToArray(tacticalActivities)
    .reduce(dictionaryReducer, {});

interface Props {
  activityFeed: Activity[],
  relativeToTime: number,
  relativeFromTime: number,
  tacticalActivities: NumberDictionary<TacticalActivity>,
  bottomActivity: Activity,
  archivedActivities: NumberDictionary<TacticalActivity>,
}

interface GroupedActivity {
  activityName: string,
  activityIdentifier: string,
  duration: number,
  spawn: Activity,
}
interface ProjectionReduction {
  trackedTime: number,
  currentActivity: Activity,
  activityBins: StringDictionary<GroupedActivity[]>
}

const PieFlavored: FC<Props> = ({
                       activityFeed,
                       relativeToTime,
                       relativeFromTime,
                       tacticalActivities,
                       bottomActivity,
                       archivedActivities,
                     }) => {


  const activityProjection: ProjectionReduction = reduceRight(
    activityFeed,
    (accum: ProjectionReduction, activity: Activity) => {
      if (accum.trackedTime < 0) {
        accum.trackedTime = activity.antecedenceTime < relativeFromTime ? relativeFromTime : activity.antecedenceTime
      }

      if (shouldTime(activity) && !accum.currentActivity.antecedenceTime) {
        accum.currentActivity = activity;
      } else if (areDifferent(accum.currentActivity, activity) && shouldTime(activity)) {
        // Different Type: Create workable chunk and start next activity.
        const currentActivity = accum.currentActivity;
        accum.currentActivity = activity;
        const adjustedAntecedenceTime = activity.antecedenceTime < relativeFromTime ? relativeFromTime : activity.antecedenceTime;
        const duration = adjustedAntecedenceTime - accum.trackedTime;
        accum.trackedTime = activity.antecedenceTime;
        const activityName: string = getActivityName(currentActivity);
        const activityIdentifier = getActivityIdentifier(currentActivity);
        if (!accum.activityBins[activityIdentifier]) {
          accum.activityBins[activityIdentifier] = [];
        }
        accum.activityBins[activityIdentifier].push({
          activityName,
          activityIdentifier,
          duration,
          spawn: currentActivity,
        });
      }
      return accum;
    },
    {
      trackedTime: -1,
      currentActivity: DEFAULT_ACTIVITY,
      activityBins: {}
    }
  );

  const bins = activityProjection.activityBins;
  const activityIdentifier = getActivityIdentifier(activityProjection.currentActivity);
  if (!bins[activityIdentifier]) {
    bins[activityIdentifier] = []
  }

  const activityName = getActivityName(activityProjection.currentActivity);
  const meow = new Date().getTime();
  const capTime = meow < relativeToTime ? meow : relativeToTime;
  const duration = capTime - activityProjection.trackedTime;
  bins[activityIdentifier].push({
    activityName,
    activityIdentifier,
    duration,
    spawn: activityProjection.currentActivity,
  });

  const bottomCapActivity: Activity = bottomActivity;
  const lastActivityInScope: Activity = activityFeed[activityFeed.length - 1];
  if (!activitiesEqual(lastActivityInScope, bottomCapActivity) && lastActivityInScope) {
    const bottomActivityIdentifier = getActivityIdentifier(bottomCapActivity);
    if (!bins[bottomActivityIdentifier]) {
      bins[bottomActivityIdentifier] = []
    }
    const bottomCapActivityName = getActivityName(bottomCapActivity);
    const bottomTime = bottomCapActivity.antecedenceTime < relativeFromTime ?
      relativeFromTime :
      bottomCapActivity.antecedenceTime;
    const bottomDuration = lastActivityInScope.antecedenceTime - bottomTime;
    bins[bottomActivityIdentifier].push({
      activityName: bottomCapActivityName,
      activityIdentifier: bottomActivityIdentifier,
      duration: bottomDuration,
      spawn: bottomActivity,
    });
  }


  const pieData = reduceRight(objectToKeyValueArray(bins),
    (accum: {name: string, value: number}[], keyValue) => {
      accum.push({
        name: keyValue.key,
        value: keyValue.value.reduce((accum, binBoi) => accum + binBoi.duration, 0)
      });
      return accum;
    }, []);


  const totalTime = pieData.reduceRight((accum, b) => accum + b.value, 0);

  useEffect(() => {
    if (activityFeed.length > 0) {
      const selection = select('#pieBoi');
      const width = 300;
      const height = 300;

      selection.select('svg').remove();

      const pieSVG = selection.append('svg')
        // @ts-ignore real
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .call(responsivefy)
        .append('g');

      const pieFlavored = pie()
        .padAngle(0.005)
        .sort(null)
        // @ts-ignore real
        .value(d => d.value);

      // @ts-ignore real
      const arcs = pieFlavored(pieData);

      const radius = Math.min(width, height) / 2;
      const arcThing = arc()
        .innerRadius(radius * 0.7)
        .outerRadius(radius - 1);

      const mappedTacticalActivities = {
        ...mapTacticalActivitiesToID(tacticalActivities),
        ...archivedActivities,
      };

      const idToColor = constructColorMappings(mappedTacticalActivities);

      pieSVG.selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", (d: any) => idToColor[d.data.name])
        .attr('opacity', 0.7)
        .attr('cursor', 'pointer')
        .attr("d", (d:any) => arcThing(d))
        .append("title")
        .text((d: any) =>
          `${getMeaningFullName(d.data.name, mappedTacticalActivities)}: ${((d.data.value / totalTime) * 100).toFixed(2)}%`);
    }
  });

  return (
    <div>
      <div style={{
        maxWidth: '300px',
        margin: 'auto',
      }} id={'pieBoi'}>

      </div>
    </div>
  );
};

const mapStateToProps = (state : GlobalState) => {
  const {activityFeed, selectedHistoryRange: {to, from}, capstone: {bottomActivity}} = selectHistoryState(state);
  const {activities, archivedActivities} = selectTacticalActivityState(state);
  return {
    activityFeed,
    relativeToTime: to,
    relativeFromTime: from,
    tacticalActivities: activities,
    archivedActivities,
    bottomActivity,
  }
};
export default connect(mapStateToProps)(PieFlavored);
