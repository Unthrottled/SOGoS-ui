import * as React from 'react';
import {useEffect} from 'react';
import {select} from 'd3-selection';
import {arc, interpolateSpectral, pie, quantize, scaleOrdinal} from 'd3'
import {connect} from "react-redux";
import {selectHistoryState, selectTacticalActivityState} from "../reducers";
import {getActivityName} from "../types/ActivityModels";
import {objectToKeyValueArray} from "../miscellanous/Tools";
import {areDifferent, getActivityIdentifier, shouldTime} from "../miscellanous/Projection";
import type {TacticalActivity} from "../types/TacticalModels";

export const getMeaningFullName = (activityId, tacticalActivities) => {
  const tacticalActivity: TacticalActivity = tacticalActivities[activityId];
  return (tacticalActivity && tacticalActivity.name) || activityId
};

const PieFlavored = ({activityFeed, relativeToTime, tacticalActivities}) => {
  const activityProjection = activityFeed.reduceRight((accum, activity) => {
    if (accum.trackedTime < 0) {
      accum.trackedTime = activity.antecedenceTime
    }

    if (shouldTime(activity) && !accum.currentActivity.antecedenceTime) {
      accum.currentActivity = activity;
    } else if (areDifferent(accum.currentActivity, activity) && shouldTime(activity)) {
      // Different Type: Create workable chunk and start next activity.
      const currentActivity = accum.currentActivity;
      accum.currentActivity = activity;
      const duration = activity.antecedenceTime - accum.trackedTime;
      accum.trackedTime = activity.antecedenceTime;
      const activityName = getActivityName(currentActivity);
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
  }, {
    trackedTime: -1,
    currentActivity: {},
    activityBins: {}
  });

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

  const pieData = objectToKeyValueArray(bins)
    .reduce((accum, keyValue) => {
      accum.push({
        name: keyValue.key,
        value: keyValue.value.reduce((accum, binBoi) => accum + binBoi.duration, 0)
      });
      return accum;
    }, []);

  useEffect(() => {
    if (activityFeed.length > 0) {
      const selection = select('#pieBoi');
      const width = 200;
      const height = 200;

      selection.select('svg').remove();

      const pieSVG = selection.append('svg')
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .style("height", '100%');

      const pieFlavored = pie()
        .padAngle(0.005)
        .sort(null)
        .value(d => d.value);

      const arcs = pieFlavored(pieData);
      const color = scaleOrdinal()
        .domain(pieData.map(d => d.value))
        .range(quantize(t => interpolateSpectral(t * 0.8 + 0.1), pieData.length).reverse());

      const radius = Math.min(width, height) / 2;
      const arcThing = arc()
        .innerRadius(radius * 0.7)
        .outerRadius(radius - 1);

      pieSVG.selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", d => color(d.data.value))
        .attr('cursor','pointer')
        .attr("d", arcThing)
        .append("title")
        .text(d => `${getMeaningFullName(d.data.name, tacticalActivities)}: ${d.data.value.toLocaleString()}`);
    }
  });

  return (
    <div style={{
      height: '100%',
    }} id={'pieBoi'}>

    </div>
  );
};

const mapStateToProps = state => {
  const {activityFeed, selectedHistoryRange: {to}} = selectHistoryState(state);
  const {activities} = selectTacticalActivityState(state);
  return {
    activityFeed,
    relativeToTime: to,
    tacticalActivities: activities
  }
};
export default connect(mapStateToProps)(PieFlavored);
