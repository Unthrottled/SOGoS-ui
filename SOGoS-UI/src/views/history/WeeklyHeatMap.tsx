import React, {FC, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {interpolateInferno, max, scaleSequential, select} from 'd3';
import {
  GlobalState,
  selectHistoryState,
  selectStrategyState,
  selectTacticalActivityState,
} from '../../reducers';
import {
  activitiesEqual,
  Activity,
  DEFAULT_ACTIVITY,
  getActivityID,
  getActivityName,
} from '../../types/ActivityTypes';
import {NumberDictionary, StringDictionary} from '../../types/BaseTypes';
import {TacticalActivity} from '../../types/TacticalTypes';
import {Objective} from '../../types/StrategyTypes';
import {breakIntoSteps, constructLinearProjection} from './LinearProjection';
import moment from 'moment';
import {MenuItem, Select} from '@material-ui/core';

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
  height = 300 - margin.top - margin.bottom,
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

type HourSteppo = {
  spawn: {start: Activity; stop: Activity};
  hour: number;
  day: number;
  value: number;
};
const WeeklyHeatMap: FC<Props> = ({
  activityFeed,
  bottomActivity,
  relativeFromTime,
}) => {
  const [linearProjection, setLinearProjection] = useState<HourSteppo[]>([]);

  const allActivities = 'all';
  const [currentActivity, setCurrentActivity] = useState('');

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
      .text(d => d)
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
      .text(d => d)
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
          ? relativeFromTime - (relativeFromTime % 86400000)
          : bottomActivity.antecedenceTime;
      const modifiedBottom: Activity = {
        ...bottomActivity,
        antecedenceTime: antecedenceTime,
      };
      modifiedFeed.push(modifiedBottom);
    }

    const linearProj = constructLinearProjection(modifiedFeed);
    const steppos = breakIntoSteps(linearProj, 3600000).filter(
      steppo =>
        !currentActivity ||
        currentActivity === allActivities ||
        currentActivity === getActivityName(steppo.spawn.start),
    );
    const hourSteps: HourSteppo[] = steppos.map((steppo, idx, arr) => {
      const dateTime = moment.unix(steppo.timeStamp / 1000);
      return {
        day: dateTime.day(),
        hour: dateTime.hour(),
        value: 1,
        spawn: steppo.spawn,
      };
    });
    setLinearProjection(hourSteps);

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
  }, [activityFeed, bottomActivity, currentActivity, relativeFromTime]);

  const activityToSteppoCount = linearProjection.reduce(
    (accum: StringDictionary<any>, steppo) => {
      const proj = steppo.spawn.start;
      const activityName = getActivityName(proj);
      const activityID = getActivityID(proj) || activityName;
      if (!accum[activityID]) {
        accum[activityID] = {
          count: 0,
          key: new Date().valueOf().toString(16),
        };
      }
      const accumElement = accum[activityID];
      accum[activityID] = {
        ...accumElement,
        name: activityName,
        count: accumElement.count + 1,
      };
      return accum;
    },
    {},
  );

  const activityOptions = Object.values(activityToSteppoCount).sort(
    (a, b) => b.count - a.count,
  );
  useEffect(() => {
    if (
      !currentActivity &&
      activityOptions.length > 0 &&
      activityOptions[0].name &&
      activityOptions[0].name !== allActivities
    ) {
      setCurrentActivity(activityOptions[0].name);
    }
  }, [activityOptions, currentActivity]);
  activityOptions.push({
    name: allActivities,
  });

  return (
    <div>
      <div id={'heatBoi'} />
      <Select
        value={currentActivity}
        onChange={event => {
          setCurrentActivity(event.target.value + '' || allActivities);
        }}>
        {activityOptions.map(value => {
          return (
            <MenuItem
              key={value.key || new Date().valueOf().toString(16)}
              value={value.name}>
              {value.name}
            </MenuItem>
          );
        })}
      </Select>
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
