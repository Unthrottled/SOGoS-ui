import * as React from 'react';
import {useEffect} from 'react';
import {select} from 'd3-selection';
import {scaleLinear} from 'd3-scale';
import {axisTop} from 'd3'
import makeStyles from "@material-ui/core/styles/makeStyles";
import {areDifferent, getActivityIdentifier, shouldTime} from "../miscellanous/Projection";
import {activitiesEqual, ActivityStrategy, getActivityID, getActivityName, RECOVERY} from "../types/ActivityModels";
import {selectActivityState, selectHistoryState, selectTacticalActivityState} from "../reducers";
import {connect} from "react-redux";
import {objectToKeyValueArray} from "../miscellanous/Tools";
import {getActivityBackgroundColor} from "../types/TacticalModels";
import {getMeaningFullName} from "./PieFlavored";


const withStyles = makeStyles(__ => ({
  timeBar: {
    fillOpacity: .7,
    strokeWidth: 6,
  },
}));

export const constructColorMappings = tacticalActivities => {
  const defaultColors = {};
  defaultColors[ActivityStrategy.GENERIC] = 'lime';
  defaultColors[RECOVERY] = 'skyblue';
  return {
    ...objectToKeyValueArray(tacticalActivities)
      .map(kv => ({key: kv.key, value: getActivityBackgroundColor(kv.value)}))
      .filter(kv => !!kv.value)
      .reduce((accum, idToColor) => {
        accum[idToColor.key] = idToColor.value;
        return accum;
      }, {}),
    ...defaultColors,
  };
};

export const responsivefy = svg => {
  const resize = () => {
    const targetWidth = parseInt(container.style("width"));
    svg.attr("width", targetWidth);
    svg.attr("height", Math.round(targetWidth / aspect));
  };

  const container = select(svg.node().parentNode),
    width = parseInt(svg.style("width")),
    height = parseInt(svg.style("height")),
    aspect = width / height;

  svg
    .attr("viewBox", `0 0 ${width}  ${height}`)
    .attr("perserveAspectRatio", "xMinYMid")
    .call(resize);

  select(window).on("resize." + container.attr("id"), resize);
};

const NINETY_MINUTES = 5400000;
const getTimeUnit = (milliseconds: number) => {
  if((milliseconds/NINETY_MINUTES) > 1) {
    return `${(milliseconds / 3600000).toFixed(2)} hours`
  } else {
    return `${(milliseconds / 60000).toFixed(2)} minutes`
  }
};

const TimeLine = ({
                    activityFeed,
                    relativeToTime,
                    relativeFromTime,
                    tacticalActivities,
                    currentActivity,
                    bottomActivity,
                  }) => {
  const classes = withStyles();
  const modifiedFeed = [...(currentActivity.antecedenceTime >= relativeFromTime &&
  currentActivity.antecedenceTime <= relativeToTime ? [currentActivity] : []),
    ...activityFeed];
  if (!activitiesEqual(modifiedFeed[modifiedFeed.length - 1], bottomActivity) && bottomActivity) {
    modifiedFeed.push(bottomActivity)
  }

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
      start: activityProjection.currentActivity,
      stop: {
        antecedenceTime: meow.valueOf(),
      }
    },
  });
  
  console.log(bins);

  useEffect(() => {
    if (modifiedFeed.length) {
      const selection = select('#timeBoi');

      const binsToArray = objectToKeyValueArray(bins);
      const lanes = binsToArray.map(kV => kV.key);

      const laneLength = lanes.length;
      const margin = {
        left: 15,
        right: 15,
        top: 40,
        bottom: 150,
      };

      const width = 2500 - margin.left - margin.right;
      const height = 1000 - margin.top - margin.bottom;

      const timeBegin = relativeFromTime;
      const timeEnd = relativeToTime;

      const x = scaleLinear()
        .domain([0, timeEnd - timeBegin])
        .range([0, width]);
      const y1 = scaleLinear()
        .domain([0, laneLength])
        .range([0, height]);

      selection.select('svg').remove();

      const timeSVG = selection.append('svg')
        .attr('width', width)
        .attr('height', height)
        .call(responsivefy)
      ;

      const ticks = 20;
      const steppyBoi = (timeEnd - timeBegin) / ticks;
      const axis = axisTop(x)
        .tickFormat((d, i) => {
          const dateBoi = new Date(relativeFromTime + (steppyBoi * i));
          const trailingZero = number => number / 10 < 1 ? 0 : '';
          const convertToPretty = numberDude => `${trailingZero(numberDude)}${numberDude}`;
          const hours = convertToPretty(dateBoi.getHours());
          const minutes = convertToPretty(dateBoi.getMinutes());
          return `${hours}:${minutes}`;
        })
      ;

      timeSVG.append("g")
        .attr("transform", `translate(0,${margin.top})`)
        .call(axis)
        .attr('font-size', 'large');

      timeSVG.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

      const timeLanes = timeSVG.append("g")
        .attr("transform", `translate(0,${margin.top})`)
        .attr("width", width)
        .attr("height", height)
        .attr("class", "mini");

      const items = binsToArray.flatMap((keyValue, index) => {
        keyValue.value.forEach((activity) => {
          activity.lane = index;
          activity.start = activity.start - timeBegin;
          activity.start = activity.start < 0 ? 0 : activity.start;
          activity.stop = activity.stop - timeBegin;
        });
        return keyValue.value
      });

      const colorToActivity = constructColorMappings(tacticalActivities);

      timeLanes.append("g")
        .selectAll(".laneLines")
        .data(items)
        .enter().append("line")
        .attr("x1", 0)
        .attr("y1", d => y1(d.lane))
        .attr("x2", width)
        .attr("y2", d => y1(d.lane))
        .attr("stroke", "lightgray");

      timeSVG.append("g")
        .selectAll(".timeBar")
        .data(items)
        .enter().append("rect")
        .attr("transform", `translate(0,${margin.top})`)
        .attr('fill', d => colorToActivity[(getActivityID(d.spawn.start))])
        .attr('opacity', 0.7)
        .attr("class", () => classes["timebar"])
        .attr("x", d => x(d.start))
        .attr("y", d => y1(d.lane) + 10)
        .attr("width", d => x(d.stop - d.start))
        .attr("height", () => .8 * y1(1))
        .append("title")
        .text(d => {
          const meaningFullName = getMeaningFullName(d.activityIdentifier, tacticalActivities);
          const millisecondsDuration = (d.spawn.stop.antecedenceTime - d.spawn.start.antecedenceTime);
          return `${meaningFullName}: ${getTimeUnit(millisecondsDuration)} `;
        });
    }
  });

  return (
    <div style={{height:'100%'}}>
      <div style={{
        height: '100%',
        margin: 'auto 0',
      }} id={'timeBoi'}>

      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const {activityFeed, selectedHistoryRange: {to, from}, capstone: {bottomActivity}} = selectHistoryState(state);
  const {activities} = selectTacticalActivityState(state);
  const {currentActivity} = selectActivityState(state);
  return {
    activityFeed,
    relativeToTime: to,
    relativeFromTime: from,
    tacticalActivities: activities,
    currentActivity,
    bottomActivity,
  }
};
export default connect(mapStateToProps)(TimeLine);
