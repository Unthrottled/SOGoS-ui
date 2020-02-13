import React, {FC, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {interpolateInferno, max, scaleSequential, select} from 'd3';
import {GlobalState, selectHistoryState, selectStrategyState, selectTacticalActivityState,} from '../../reducers';
import {activitiesEqual, Activity, DEFAULT_ACTIVITY,} from '../../types/ActivityTypes';
import {NumberDictionary, StringDictionary} from '../../types/BaseTypes';
import {TacticalActivity} from '../../types/TacticalTypes';
import {Objective} from '../../types/StrategyTypes';
import {breakIntoSteps, constructLinearProjection} from './LinearProjection';
import moment from 'moment';

interface Props {
  activityFeed: Activity[];
  relativeToTime: number;
  relativeFromTime: number;
  tacticalActivities: NumberDictionary<TacticalActivity>;
  bottomActivity: Activity;
  archivedActivities: NumberDictionary<TacticalActivity>;
  objectives: StringDictionary<Objective>;
}

const margin = {top: 50, right: 0, bottom: 100, left: 30},
  width = 800 - margin.left - margin.right,
  height = 430 - margin.top - margin.bottom,
  gridSize = Math.floor(width / 24),
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
  ];

const WeeklyHeatMap: FC<Props> = ({
                                    activityFeed,
                                    bottomActivity,
                                    relativeFromTime,
                                  }) => {
  const [linearProjection, setLinearProjection] = useState([]);

  useEffect(() => {
    const selection = select('#heatBoi');
    selection.select('svg').remove();
    const heatBoiSvg = selection
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    heatBoiSvg
      .selectAll('.dayLabel')
      .data(days)
      .enter()
      .append('text')
      .text(function (d) {
        return d;
      })
      .attr('x', 0)
      .attr('y', (d, i) => i * gridSize)
      .style('text-anchor', 'end')
      .attr('font-size', '1rem')
      .attr('transform', 'translate(-6,' + gridSize / 1.5 + ')')
      .attr('class', (d, i) =>
        i >= 0 && i <= 4
          ? 'dayLabel mono axis axis-workweek'
          : 'dayLabel mono axis',
      );

    heatBoiSvg
      .selectAll('.timeLabel')
      .data(times)
      .enter()
      .append('text')
      .text(function (d) {
        return d;
      })
      .attr('x', (d, i) => i * gridSize)
      .attr('y', 0)
      .style('text-anchor', 'middle')
      .attr('transform', 'translate(' + gridSize / 2 + ', -6)')
      .attr('font-size', '1rem')
      .attr('class', (d, i) =>
        i >= 7 && i <= 16
          ? 'timeLabel mono axis axis-worktime'
          : 'timeLabel mono axis',
      );

    const modifiedFeed = [...activityFeed];

    if (
      !activitiesEqual(activityFeed[activityFeed.length - 1], bottomActivity) &&
      bottomActivity &&
      bottomActivity !== DEFAULT_ACTIVITY
    ) {
      const antecedenceTime =
        bottomActivity.antecedenceTime < relativeFromTime
          ? relativeFromTime
          : bottomActivity.antecedenceTime;
      const modifiedBottom: Activity = {
        ...bottomActivity,
        antecedenceTime: antecedenceTime,
      };
      modifiedFeed.push(modifiedBottom);
    }

    const linearProjection = constructLinearProjection(modifiedFeed);
    const steppos = breakIntoSteps(linearProjection, 3600000);
    const hourSteps = steppos.map((steppo, idx, arr) => {
      const dateTime = moment.unix(steppo.timeStamp / 1000);
      // if (idx > 0) {
      //   const other = moment.unix(arr[idx - 1].timeStamp / 1000);
      //   console.log(`
      //   diffy ${moment.duration(dateTime.diff(other)).asHours()}
      //   `);
      // }
      return {
        day: dateTime.day(),
        hour: dateTime.hour(),
        value: 1,
      };
    });

    if (steppos.length) {
      // console.log(
      //   `time between first and last ${moment
      //     .duration(
      //       moment
      //         .unix(steppos[steppos.length - 1].timeStamp / 1000)
      //         .diff(moment.unix(steppos[0].timeStamp / 1000)),
      //     )
      //     .asDays()}`,
      // );
    }

    const weekProjection = hourSteps.reduce((accum: any, {day, hour}) => {
      if (!accum[day]) {
        accum[day] = {};
      }
      if (!accum[day][hour]) {
        accum[day][hour] = 0;
      }
      accum[day][hour] += 1;
      return accum;
    }, {});

    const steps = Object.entries<StringDictionary<number>>(
      weekProjection,
    ).flatMap(dayEntry =>
      Object.entries(dayEntry[1]).map(hourEntry => ({
        day: +dayEntry[0] + 1,
        hour: +hourEntry[0] + 1,
        value: hourEntry[1],
      })),
    );

    const colorScale = scaleSequential(interpolateInferno)
      .interpolator(interpolateInferno)
      .domain([0, max(steps, s => s.value) || 1]);

    const hourHeatBoxes = heatBoiSvg
      .selectAll('.hour')
      .data(steps, (d: any) => d.value);

    hourHeatBoxes
      .enter()
      .append('rect')
      .attr('x', d => (d.hour - 1) * gridSize)
      .attr('y', d => (d.day - 1) * gridSize)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('class', 'hour bordered')
      .attr('width', gridSize)
      .attr('height', gridSize)
      .style('fill', d => colorScale(d.value));

    hourHeatBoxes
      .transition()
      .duration(1000)
      .style('fill', d => colorScale(d.value));

    hourHeatBoxes.select('title').text(d => d.value);
  }, [activityFeed, bottomActivity, relativeFromTime]);

  return (
    <div>
      <div id={'heatBoi'}/>
    </div>
  );
};

const mapStateToProps = (state: GlobalState): Props => {
  const {
    activityFeed,
    selectedHistoryRange: {to, from},
    capstone: {bottomActivity},
  } = selectHistoryState(state);
  const {objectives} = selectStrategyState(state);
  const {activities, archivedActivities} = selectTacticalActivityState(state);
  return {
    activityFeed,
    relativeToTime: to,
    relativeFromTime: from,
    tacticalActivities: activities,
    archivedActivities,
    bottomActivity,
    objectives,
  };
};

export default connect(mapStateToProps)(WeeklyHeatMap);

// heatmap will show one/more activity.
