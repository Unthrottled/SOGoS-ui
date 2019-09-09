import * as React from 'react';
import {useEffect} from 'react';
import {select} from 'd3-selection';
import {scaleLinear} from 'd3-scale';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {areDifferent, getActivityIdentifier, shouldTime} from "../miscellanous/Projection";
import {getActivityName} from "../types/ActivityModels";
import {selectHistoryState} from "../reducers";
import {connect} from "react-redux";
import {objectToKeyValueArray} from "../miscellanous/Tools";

type Props = {};

const withStyles = makeStyles(theme => ({
  miniItem0: {
    fill: 'darksalmon',
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

const TimeLine = ({activityFeed}) => {
  const classes = withStyles();

  const activityProjection = activityFeed.reduceRight((accum, activity) => {
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
  bins[activityIdentifier].push({
    activityName,
    activityIdentifier,
    start: activityProjection.currentActivity.antecedenceTime,
    stop: new Date().getTime(),
    spawn: {
      start: activityProjection.currentActivity.antecedenceTime,
      stop: "Meow"
    },
  });

  useEffect(() => {
    if (activityFeed.length) {
      const selection = select('#timeBoi');

      const binsToArray = objectToKeyValueArray(bins);
      const lanes = binsToArray.map(kV => kV.key);
      
      const laneLength = lanes.length;
      const m = [20, 15, 15, 120], //top right bottom left
        w = 1500 - m[1] - m[3],
        h = 500 - m[0] - m[2],
        miniHeight = laneLength * 12 + 50,
        mainHeight = h - miniHeight - 50;

      const timeBegin = activityFeed[activityFeed.length - 1].antecedenceTime;
      const timeEnd = activityFeed[0].antecedenceTime;
      
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
        keyValue.value.forEach((activity)=>{
          activity.lane = index;
          activity.start =  activity.start - timeBegin;
          activity.stop =  activity.stop - timeBegin;
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
        .text(d => d)
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


var
  items = [{"lane": 0, "id": "Qin", "start": 5, "end": 205},
    {"lane": 0, "id": "Jin", "start": 265, "end": 420},
    {"lane": 0, "id": "Sui", "start": 580, "end": 615},
    {"lane": 0, "id": "Tang", "start": 620, "end": 900},
    {"lane": 0, "id": "Song", "start": 960, "end": 1265},
    {"lane": 0, "id": "Yuan", "start": 1270, "end": 1365},
    {"lane": 0, "id": "Ming", "start": 1370, "end": 1640},
    {"lane": 0, "id": "Qing", "start": 1645, "end": 1910},
    {"lane": 1, "id": "Yamato", "start": 300, "end": 530},
    {"lane": 1, "id": "Asuka", "start": 550, "end": 700},
    {"lane": 1, "id": "Nara", "start": 710, "end": 790},
    {"lane": 1, "id": "Heian", "start": 800, "end": 1180},
    {"lane": 1, "id": "Kamakura", "start": 1190, "end": 1330},
    {"lane": 1, "id": "Muromachi", "start": 1340, "end": 1560},
    {"lane": 1, "id": "Edo", "start": 1610, "end": 1860},
    {"lane": 1, "id": "Meiji", "start": 1870, "end": 1900},
    {"lane": 1, "id": "Taisho", "start": 1910, "end": 1920},
    {"lane": 1, "id": "Showa", "start": 1925, "end": 1985},
    {"lane": 1, "id": "Heisei", "start": 1990, "end": 1995},
    {"lane": 2, "id": "Three Kingdoms", "start": 10, "end": 670},
    {"lane": 2, "id": "North and South States", "start": 690, "end": 900},
    {"lane": 2, "id": "Goryeo", "start": 920, "end": 1380},
    {"lane": 2, "id": "Joseon", "start": 1390, "end": 1890},
    {"lane": 2, "id": "Korean Empire", "start": 1900, "end": 1945}];


const mapStateToProps = state => {
  const {activityFeed} = selectHistoryState(state);
  return {
    activityFeed
  }
};
export default connect(mapStateToProps)(TimeLine);