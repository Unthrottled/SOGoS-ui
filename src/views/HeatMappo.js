import * as React from 'react';
import {useEffect, useState} from 'react';
import {select} from 'd3-selection';
import {quantile, max, quantize, interpolateSpectral} from 'd3';
import {scaleQuantile, scaleOrdinal} from 'd3-scale';

type Props = {};
export const HeatMappo = (props: Props) => {
  const [didMountState] = useState('');
  useEffect(() => {
    const selection = select('#heatBoi');
    var margin = {top: 50, right: 0, bottom: 100, left: 30},
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom,
      gridSize = Math.floor(width / 24),
      buckets = 9,
      colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"], // alternatively colorbrewer.YlGnBu[9]
      days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];

    const pieSVG = selection.append('svg')
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
      .attr("viewBox", [0,0, width, height])
      .style("width", '100%')
      .style("height", '100%')
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const dayLabels = pieSVG.selectAll(".dayLabel")
      .data(days)
      .enter().append("text")
      .text(d => d)
      .attr("x", 0)
      .attr("y", function (d, i) {
        return i * gridSize;
      })
      .style("text-anchor", "end")
      .style("font-size", 12)
      .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
      .attr("class", (d, i) =>
        ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"));

    const timeLabels = pieSVG.selectAll(".timeLabel")
      .data(times)
      .enter().append("text")
      .text(d => d)
      .attr("x", (d, i) => i * gridSize)
      .attr("y", 0)
      .style("text-anchor", "middle")
      .style("font-size", 12)
      .attr("transform", "translate(" + gridSize / 2 + ", -6)")
      .attr("class", (d, i) =>
        ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"));

    var heatmapChart = function (data) {

      var colorScale = scaleOrdinal()
        .domain([0, buckets - 1, max(data, function (d) {
          return d.value;
        })])
        .range(colors);

      const color = scaleOrdinal()
        .domain([0, max(data, d => d.value)])
        .range(colors);

      var cards = pieSVG.selectAll(".hour")
        .data(data, function (d) {
          return d.day + ':' + d.hour;
        });

      cards.append("title");

      cards.enter().append("rect")
        .attr("x", function (d) {
          return (d.hour - 1) * gridSize;
        })
        .attr("y", function (d) {
          return (d.day - 1) * gridSize;
        })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", d=>color(d.value));

      cards.transition().duration(1000)
        .style("fill", d => color(d.value));

      cards.select("title").text(d => d.value);

      cards.exit().remove();
    };

    heatmapChart(dateData);


  }, [didMountState]);

  return (
    <div style={{
      height: '100%',
    }} id={'heatBoi'}>

    </div>
  );
};

const dateData =

  [{ "day": 1, "hour":	1, "value":	16 },
    { "day": 1, "hour":	2, "value":	20 },
    { "day": 1, "hour":	3, "value":	0 },
    { "day": 1, "hour":	4, "value":	0 },
    { "day": 1, "hour":	5, "value":	0 },
    { "day": 1, "hour":	6, "value":	2 },
    { "day": 1, "hour":	7, "value":	0 },
    { "day": 1, "hour":	8, "value":	9 },
    { "day": 1, "hour":	9, "value":	25 },
    { "day": 1, "hour":	10, "value":	49 },
    { "day": 1, "hour":	11, "value":	57 },
    { "day": 1, "hour":	12, "value":	61 },
    { "day": 1, "hour":	13, "value":	37 },
    { "day": 1, "hour":	14, "value":	66 },
    { "day": 1, "hour":	15, "value":	70 },
    { "day": 1, "hour":	16, "value":	55 },
    { "day": 1, "hour":	17, "value":	51 },
    { "day": 1, "hour":	18, "value":	55 },
    { "day": 1, "hour":	19, "value":	17 },
    { "day": 1, "hour":	20, "value":	20 },
    { "day": 1, "hour":	21, "value":	9 },
    { "day": 1, "hour":	22, "value":	4 },
    { "day": 1, "hour":	23, "value":	0 },
    { "day": 1, "hour":	24, "value":	12 },
    { "day": 2, "hour":	1, "value":	6 },
    { "day": 2, "hour":	2, "value":	2 },
    { "day": 2, "hour":	3, "value":	0 },
    { "day": 2, "hour":	4, "value":	0 },
    { "day": 2, "hour":	5, "value":	0 },
    { "day": 2, "hour":	6, "value":	2 },
    { "day": 2, "hour":	7, "value":	4 },
    { "day": 2, "hour":	8, "value":	11 },
    { "day": 2, "hour":	9, "value":	28 },
    { "day": 2, "hour":	10, "value":	49 },
    { "day": 2, "hour":	11, "value":	51 },
    { "day": 2, "hour":	12, "value":	47 },
    { "day": 2, "hour":	13, "value":	38 },
    { "day": 2, "hour":	14, "value":	65 },
    { "day": 2, "hour":	15, "value":	60 },
    { "day": 2, "hour":	16, "value":	50 },
    { "day": 2, "hour":	17, "value":	65 },
    { "day": 2, "hour":	18, "value":	50 },
    { "day": 2, "hour":	19, "value":	22 },
    { "day": 2, "hour":	20, "value":	11 },
    { "day": 2, "hour":	21, "value":	12 },
    { "day": 2, "hour":	22, "value":	9 },
    { "day": 2, "hour":	23, "value":	0 },
    { "day": 2, "hour":	24, "value":	13 },
    { "day": 3, "hour":	1, "value":	5 },
    { "day": 3, "hour":	2, "value":	8 },
    { "day": 3, "hour":	3, "value":	8 },
    { "day": 3, "hour":	4, "value":	0 },
    { "day": 3, "hour":	5, "value":	0 },
    { "day": 3, "hour":	6, "value":	2 },
    { "day": 3, "hour":	7, "value":	5 },
    { "day": 3, "hour":	8, "value":	12 },
    { "day": 3, "hour":	9, "value":	34 },
    { "day": 3, "hour":	10, "value":	43 },
    { "day": 3, "hour":	11, "value":	54 },
    { "day": 3, "hour":	12, "value":	44 },
    { "day": 3, "hour":	13, "value":	40 },
    { "day": 3, "hour":	14, "value":	48 },
    { "day": 3, "hour":	15, "value":	54 },
    { "day": 3, "hour":	16, "value":	59 },
    { "day": 3, "hour":	17, "value":	60 },
    { "day": 3, "hour":	18, "value":	51 },
    { "day": 3, "hour":	19, "value":	21 },
    { "day": 3, "hour":	20, "value":	16 },
    { "day": 3, "hour":	21, "value":	9 },
    { "day": 3, "hour":	22, "value":	5 },
    { "day": 3, "hour":	23, "value":	4 },
    { "day": 3, "hour":	24, "value":	7 },
    { "day": 4, "hour":	1, "value":	0 },
    { "day": 4, "hour":	2, "value":	0 },
    { "day": 4, "hour":	3, "value":	0 },
    { "day": 4, "hour":	4, "value":	0 },
    { "day": 4, "hour":	5, "value":	0 },
    { "day": 4, "hour":	6, "value":	2 },
    { "day": 4, "hour":	7, "value":	4 },
    { "day": 4, "hour":	8, "value":	13 },
    { "day": 4, "hour":	9, "value":	26 },
    { "day": 4, "hour":	10, "value":	58 },
    { "day": 4, "hour":	11, "value":	61 },
    { "day": 4, "hour":	12, "value":	59 },
    { "day": 4, "hour":	13, "value":	53 },
    { "day": 4, "hour":	14, "value":	54 },
    { "day": 4, "hour":	15, "value":	64 },
    { "day": 4, "hour":	16, "value":	55 },
    { "day": 4, "hour":	17, "value":	52 },
    { "day": 4, "hour":	18, "value":	53 },
    { "day": 4, "hour":	19, "value":	18 },
    { "day": 4, "hour":	20, "value":	3 },
    { "day": 4, "hour":	21, "value":	9 },
    { "day": 4, "hour":	22, "value":	12 },
    { "day": 4, "hour":	23, "value":	2 },
    { "day": 4, "hour":	24, "value":	8 },
    { "day": 5, "hour":	1, "value":	2 },
    { "day": 5, "hour":	2, "value":	0 },
    { "day": 5, "hour":	3, "value":	8 },
    { "day": 5, "hour":	4, "value":	2 },
    { "day": 5, "hour":	5, "value":	0 },
    { "day": 5, "hour":	6, "value":	2 },
    { "day": 5, "hour":	7, "value":	4 },
    { "day": 5, "hour":	8, "value":	14 },
    { "day": 5, "hour":	9, "value":	31 },
    { "day": 5, "hour":	10, "value":	48 },
    { "day": 5, "hour":	11, "value":	46 },
    { "day": 5, "hour":	12, "value":	50 },
    { "day": 5, "hour":	13, "value":	66 },
    { "day": 5, "hour":	14, "value":	54 },
    { "day": 5, "hour":	15, "value":	56 },
    { "day": 5, "hour":	16, "value":	67 },
    { "day": 5, "hour":	17, "value":	54 },
    { "day": 5, "hour":	18, "value":	23 },
    { "day": 5, "hour":	19, "value":	14 },
    { "day": 5, "hour":	20, "value":	6 },
    { "day": 5, "hour":	21, "value":	8 },
    { "day": 5, "hour":	22, "value":	7 },
    { "day": 5, "hour":	23, "value":	0 },
    { "day": 5, "hour":	24, "value":	8 },
    { "day": 6, "hour":	1, "value":	2 },
    { "day": 6, "hour":	2, "value":	0 },
    { "day": 6, "hour":	3, "value":	2 },
    { "day": 6, "hour":	4, "value":	0 },
    { "day": 6, "hour":	5, "value":	0 },
    { "day": 6, "hour":	6, "value":	0 },
    { "day": 6, "hour":	7, "value":	4 },
    { "day": 6, "hour":	8, "value":	8 },
    { "day": 6, "hour":	9, "value":	8 },
    { "day": 6, "hour":	10, "value":	6 },
    { "day": 6, "hour":	11, "value":	14 },
    { "day": 6, "hour":	12, "value":	12 },
    { "day": 6, "hour":	13, "value":	9 },
    { "day": 6, "hour":	14, "value":	14 },
    { "day": 6, "hour":	15, "value":	0 },
    { "day": 6, "hour":	16, "value":	4 },
    { "day": 6, "hour":	17, "value":	7 },
    { "day": 6, "hour":	18, "value":	6 },
    { "day": 6, "hour":	19, "value":	0 },
    { "day": 6, "hour":	20, "value":	0 },
    { "day": 6, "hour":	21, "value":	0 },
    { "day": 6, "hour":	22, "value":	0 },
    { "day": 6, "hour":	23, "value":	0 },
    { "day": 6, "hour":	24, "value":	0 },
    { "day": 7, "hour":	1, "value":	7 },
    { "day": 7, "hour":	2, "value":	6 },
    { "day": 7, "hour":	3, "value":	0 },
    { "day": 7, "hour":	4, "value":	0 },
    { "day": 7, "hour":	5, "value":	0 },
    { "day": 7, "hour":	6, "value":	0 },
    { "day": 7, "hour":	7, "value":	0 },
    { "day": 7, "hour":	8, "value":	0 },
    { "day": 7, "hour":	9, "value":	0 },
    { "day": 7, "hour":	10, "value":	0 },
    { "day": 7, "hour":	11, "value":	2 },
    { "day": 7, "hour":	12, "value":	2 },
    { "day": 7, "hour":	13, "value":	5 },
    { "day": 7, "hour":	14, "value":	6 },
    { "day": 7, "hour":	15, "value":	0 },
    { "day": 7, "hour":	16, "value":	4 },
    { "day": 7, "hour":	17, "value":	0 },
    { "day": 7, "hour":	18, "value":	2 },
    { "day": 7, "hour":	19, "value":	10 },
    { "day": 7, "hour":	20, "value":	7 },
    { "day": 7, "hour":	21, "value":	0 },
    { "day": 7, "hour":	22, "value":	19 },
    { "day": 7, "hour":	23, "value":	9 },
    { "day": 7, "hour":	24, "value":	4 },];