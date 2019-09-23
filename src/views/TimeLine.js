import * as React from 'react';
import {useEffect} from 'react';
import {select} from 'd3-selection';
import {scaleLinear} from 'd3-scale';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {areDifferent, getActivityIdentifier, shouldTime} from "../miscellanous/Projection";
import {getActivityName} from "../types/ActivityModels";
import {selectActivityState, selectHistoryState, selectTacticalActivityState} from "../reducers";
import {connect} from "react-redux";
import {objectToKeyValueArray} from "../miscellanous/Tools";
import {getMeaningFullName} from "./PieFlavored";


const withStyles = makeStyles(__ => ({
  miniItem0: {
    fill: 'darksalmon',
    fillOpacity: .7,
    strokeWidth: 6,
  },

  miniItem1: {
    fill: 'darkolivegreen',
    fillOpacity: .7,
    strokeWidth: 6,
  },

  miniItem2: {
    fill: 'slategray',
    fillOpacity: .7,
    strokeWidth: 6,
  },
  miniItem3: {
    fill: 'purple',
    fillOpacity: .7,
    strokeWidth: 6,
  }
}));

const TimeLine = ({
                    activityFeed,
                    relativeToTime,
                    relativeFromTime,
                    tacticalActivities,
                    currentActivity
                  }) => {
  const classes = withStyles();
  const modifiedFeed = [currentActivity, ...activityFeed];
  const activityProjection = modifiedFeed.reduceRight((accum, activity) => {
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
    currentActivity: {},
    activityBins: {}
  });

  const bins = activityProjection.activityBins;
  const activityIdentifier = getActivityIdentifier(activityProjection.currentActivity);
  if (!bins[activityIdentifier]) {
    bins[activityIdentifier] = []
  }
  const activityName = getActivityName(activityProjection.currentActivity);
  const meow = new Date().valueOf();
  bins[activityIdentifier].push({
    activityName,
    activityIdentifier,
    start: activityProjection.currentActivity.antecedenceTime,
    stop: relativeToTime > meow ? meow : relativeToTime,
    spawn: {
      start: activityProjection.currentActivity.antecedenceTime,
      stop: "Meow"
    },
  });
  
  useEffect(() => {
    if (modifiedFeed.length) {
      const selection = select('#timeBoi');

      const binsToArray = objectToKeyValueArray(bins);
      const lanes = binsToArray.map(kV => kV.key);
      
      const laneLength = lanes.length;
      const m = [20, 15, 15, 120], //top right bottom left
        w = 1500 - m[1] - m[3],
        h = 500 - m[0] - m[2],
        miniHeight = laneLength * 12 + 50,
        mainHeight = h - miniHeight - 50;

      const timeBegin = relativeFromTime;
      const timeEnd = relativeToTime;

      var x = scaleLinear()
        .domain([0, timeEnd - timeBegin])
        .range([0, w]);
      var y1 = scaleLinear()
        .domain([0, laneLength])
        .range([0, h]);

      selection.select('svg').remove();

      const timeSVG = selection.append('svg')
        .attr("viewBox", [0, 0, w, h])
        .style("height", '100%')
        .style("width", '100%')
      ;

      timeSVG.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", w)
        .attr("height", mainHeight);

      var mini = timeSVG.append("g")
        .attr("transform", "translate(" + m[3] + "," + (m[0]) + ")")
        .attr("width", w)
        .attr("height", h)
        .attr("class", "mini");

      const items = binsToArray.flatMap((keyValue, index) => {
        keyValue.value.forEach((activity) => {
          activity.lane = index;
          activity.start = activity.start - timeBegin;
          activity.stop = activity.stop - timeBegin;
          // activity.id = keyValue.key;
        });
        return keyValue.value
      });

      mini.append("g").selectAll(".laneLines")
        .data(items)
        .enter().append("line")
        .attr("x1", m[1])
        .attr("y1", d => y1(d.lane))
        .attr("x2", w)
        .attr("y2", d => y1(d.lane))
        .attr("stroke", "lightgray");

      mini.append("g").selectAll(".laneText")
        .data(lanes)
        .enter().append("text")
        .attr('font-size', '.75em')
        .text(d => getMeaningFullName(d, tacticalActivities))
        .attr("x", -m[1])
        .attr("y", (d, i) => y1(i + .5))
        .attr("dy", ".5ex")
        .attr("text-anchor", "end")
        .attr("class", "laneText");

      mini.append("g").selectAll("miniItems")
        .data(items)
        .enter().append("rect")
        .attr("class", d => classes["miniItem" + d.lane])
        .attr("x", d => x(d.start))
        .attr("y", d => y1(d.lane) + 10)
        .attr("width", d => x(d.stop - d.start))
        .attr("height", () => .8 * y1(1));

      //mini labels
      mini.append("g").selectAll(".miniLabels")
        .data(items)
        .enter().append("text")
        .text(d => d.id)
        .attr("x", d => x(d.start))
        .attr("y", d => y1(d.lane + .5))
        .attr("dy", ".5ex");

      mini.append("g")
        .attr("class", "x brush")
        .selectAll("rect")
        .attr("y", 1)
        .attr("height", miniHeight - 1);
    }
  });

  return (
    <div style={{
      height: '100%',
    }} id={'timeBoi'}>

    </div>
  );
};

const mapStateToProps = state => {
  const {activityFeed, selectedHistoryRange: {to, from}} = selectHistoryState(state);
  const {activities} = selectTacticalActivityState(state);
  const {currentActivity} = selectActivityState(state);
  return {
    activityFeed,
    relativeToTime: to,
    relativeFromTime: from,
    tacticalActivities: activities,
    currentActivity,
  }
};
export default connect(mapStateToProps)(TimeLine);
