import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {interpolateInferno, max, scaleSequential, select, tsv} from 'd3';
import {GlobalState} from '../../reducers';

const WeeklyHeatMap = () => {
  useEffect(() => {
    const margin = {top: 50, right: 0, bottom: 100, left: 30},
      width = 800 - margin.left - margin.right,
      height = 430 - margin.top - margin.bottom,
      gridSize = Math.floor(width / 24),
      buckets = 9,
      days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
      times = [
        '1a',
        '2a',
        '3a',
        '4a',
        '5a',
        '6a',
        '7a',
        '8a',
        '9a',
        '10a',
        '11a',
        '12a',
        '1p',
        '2p',
        '3p',
        '4p',
        '5p',
        '6p',
        '7p',
        '8p',
        '9p',
        '10p',
        '11p',
        '12p',
      ],
      datasets = ['http://172.17.0.1:3000/data1.tsv'];

    const svg = select('#heatBoi')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const dayLabels = svg
      .selectAll('.dayLabel')
      .data(days)
      .enter()
      .append('text')
      .text(function(d) {
        return d;
      })
      .attr('x', 0)
      .attr('y', (d, i) => i * gridSize)
      .style('text-anchor', 'end')
      .attr('transform', 'translate(-6,' + gridSize / 1.5 + ')')
      .attr('class', (d, i) =>
        i >= 0 && i <= 4
          ? 'dayLabel mono axis axis-workweek'
          : 'dayLabel mono axis',
      );

    const timeLabels = svg
      .selectAll('.timeLabel')
      .data(times)
      .enter()
      .append('text')
      .text(function(d) {
        return d;
      })
      .attr('x', (d, i) => i * gridSize)
      .attr('y', 0)
      .style('text-anchor', 'middle')
      .attr('transform', 'translate(' + gridSize / 2 + ', -6)')
      .attr('class', (d, i) =>
        i >= 7 && i <= 16
          ? 'timeLabel mono axis axis-worktime'
          : 'timeLabel mono axis',
      );

    const heatmapChart = function(tsvFile: string) {
      tsv(tsvFile, (d: any) => ({
        day: +d.day,
        hour: +d.hour,
        value: +d.value,
      })).then((data: {hour: number; day: number; value: number}[]) => {
        const colorScale = scaleSequential(interpolateInferno)
          .interpolator(interpolateInferno)
          .domain([0, max(data, d => d.value) || buckets - 1]);

        const cards = svg
          .selectAll('.hour')
          .data(data, (d: any) => d.day + ':' + d.hour);

        cards
          .enter()
          .append('rect')
          .attr('x', function(d) {
            return (d.hour - 1) * gridSize;
          })
          .attr('y', function(d) {
            return (d.day - 1) * gridSize;
          })
          .attr('rx', 4)
          .attr('ry', 4)
          .attr('class', 'hour bordered')
          .attr('width', gridSize)
          .attr('height', gridSize)
          .style('fill', d => colorScale(d.value));

        cards
          .transition()
          .duration(1000)
          .style('fill', d => colorScale(d.value));

        cards.select('title').text(function(d) {
          return d.value;
        });

        cards.exit().remove();
      });
    };

    heatmapChart(datasets[0]);
  });

  return (
    <div>
      <div id={'heatBoi'} />
    </div>
  );
};

const mapStateToProps = (globalState: GlobalState) => {
  return {};
};

export default connect(mapStateToProps)(WeeklyHeatMap);

// heatmap will show one/more activity.
