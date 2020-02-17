import React, {FC, useEffect, useState} from 'react';
import range from 'lodash/range';
import {connect} from 'react-redux';
import {max, scaleSequential, select} from 'd3';
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
import {constructLinearProjection, LinearProjection} from './LinearProjection';
import moment from 'moment';
import {MenuItem, Select} from '@material-ui/core';
import {getMeaningFullName, mapTacticalActivitiesToID} from './PieFlavored';
import {ActivityProjection} from './Projections';
import {constructColorMappings} from './TimeLine';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {TacticalActivityIcon} from '../icons/TacticalActivityIcon';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  container: {
    borderTop: 'solid 1px rgba(0,0,0, .15)',
  },
  legendLabel: {
    flexGrow: 1,
    textAlign: 'right',
  },
}));

interface Props {
  activityFeed: Activity[];
  relativeToTime: number;
  relativeFromTime: number;
  tacticalActivities: NumberDictionary<TacticalActivity>;
  bottomActivity: Activity;
  archivedActivities: NumberDictionary<TacticalActivity>;
  objectives: StringDictionary<Objective>;
}

export const breakIntoHeatSteps = (
  linearProjection: LinearProjection,
  stepSize: number,
) =>
  linearProjection.activityBins.flatMap((projection: ActivityProjection) => {
    const closestFullStep = projection.start - (projection.start % stepSize);
    const closestEndingStep =
      projection.stop - (projection.stop % stepSize) + stepSize;
    const fullSteps = (closestEndingStep - closestFullStep) / stepSize;

    const fullTimeSteps = Array(fullSteps)
      .fill(0)
      .map((_, index) => ({
        timeStamp: closestFullStep + stepSize * index,
        spawn: projection.spawn,
        value: 1,
      }));

    const fullTimeStepsLength = fullTimeSteps.length;
    if (fullTimeStepsLength) {
      fullTimeSteps[0] = {
        ...fullTimeSteps[0],
        value: 1 - (projection.start - closestFullStep) / stepSize,
      };
      const lastFullStep = fullTimeSteps[fullTimeStepsLength - 1];
      fullTimeSteps[fullTimeStepsLength - 1] = {
        ...lastFullStep,
        value:
          lastFullStep.value - (closestEndingStep - projection.stop) / stepSize,
      };
    }

    return fullTimeSteps;
  });

const margin = {top: 50, right: 0, bottom: 100, left: 30},
  width = 800 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom,
  gridSize = Math.floor(width / 24),
  days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
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
  tacticalActivities,
  archivedActivities,
}) => {
  const [filteredLinearProjection, setFilteredLinearProjection] = useState<
    HourSteppo[]
  >([]);
  const [linearProjection, setLinearProjection] = useState<HourSteppo[]>([]);

  const [currentActivity, setCurrentActivity] = useState<{
    name: string;
    key: string;
    count: number;
  }>({
    name: '',
    key: '',
    count: 0,
  });

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

    const earliestActivity = activityFeed[activityFeed.length - 1];
    if (
      !activitiesEqual(earliestActivity, bottomActivity) &&
      bottomActivity &&
      bottomActivity !== DEFAULT_ACTIVITY &&
      (earliestActivity &&
        earliestActivity.antecedenceTime >= bottomActivity.antecedenceTime)
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
    const unfilteredSteppos = breakIntoHeatSteps(linearProj, 3600000);
    const filterdSteppos = unfilteredSteppos.filter(
      steppo =>
        !currentActivity ||
        currentActivity.name === getActivityName(steppo.spawn.start),
    );
    const timeSteppoMaker = (steppo: {
      timeStamp: number;
      value: number;
      spawn: any;
    }) => {
      const dateTime = moment.unix(steppo.timeStamp / 1000);
      return {
        day: dateTime.day(),
        hour: dateTime.hour(),
        value: steppo.value,
        spawn: steppo.spawn,
      };
    };
    const unfilteredHourSteppo: HourSteppo[] = unfilteredSteppos.map(
      timeSteppoMaker,
    );
    const filteredHourSteppo: HourSteppo[] = filterdSteppos.map(
      timeSteppoMaker,
    );

    setFilteredLinearProjection(filteredLinearProjection);
    setLinearProjection(unfilteredHourSteppo);

    const weekProjection = filteredHourSteppo.reduce(
      (accum: any, {day, hour, value}) => {
        if (!accum[day]) {
          accum[day] = {};
        }
        if (!accum[day][hour]) {
          accum[day][hour] = 0;
        }
        accum[day][hour] += value;
        return accum;
      },
      {},
    );

    const steps = Object.entries<StringDictionary<number>>(
      weekProjection,
    ).flatMap(dayEntry =>
      Object.entries(dayEntry[1]).map(hourEntry => ({
        day: +dayEntry[0] + 1,
        hour: +hourEntry[0] + 1,
        value: hourEntry[1],
      })),
    );

    const mappedTacticalActivities = {
      ...mapTacticalActivitiesToID(tacticalActivities),
      ...archivedActivities,
    };

    const almostMaxValue = max(steps, s => +s.value) || 1;
    const maxValue = almostMaxValue < 1 ? 1 : almostMaxValue;
    const domain: [number, number] = [0, maxValue];
    const colorMappings = constructColorMappings(mappedTacticalActivities);
    const colorScale = (_: number) => colorMappings[currentActivity.key];
    const opacityScale = scaleSequential(n => n + 1e-2).domain(domain);

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
      .style('opacity', d => opacityScale(d.value))
      .style('fill', d => colorScale(d.value))
      .append('title')
      .text((d: any) => moment.duration(d.value * 3600000).humanize());

    const legend = select('#legend27');
    legend.select('svg').remove();
    const legendRange = range(0, 1.1, 0.1);
    const legendWidth = legendRange.length * gridSize;
    const legendSvg = legend
      .append('svg')
      .attr('width', legendWidth)
      .attr('height', gridSize);

    const legendRect = legendSvg.selectAll('.legend').data(legendRange);

    legendRect
      .enter()
      .append('g')
      .attr('class', 'legend')
      .append('rect')
      .attr('x', (d, i) => gridSize * i)
      .style('fill', (d, i) => colorScale(i))
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('class', 'hour bordered')
      .attr('width', gridSize)
      .attr('height', gridSize)
      .style('opacity', d => d)
      .style('fill', d => colorScale(d));

    legendRect.exit().remove();
  }, [
    activityFeed,
    archivedActivities,
    bottomActivity,
    currentActivity,
    filteredLinearProjection,
    relativeFromTime,
    tacticalActivities,
  ]);

  const activityToSteppoCount = linearProjection.reduce(
    (accum: StringDictionary<any>, steppo) => {
      const proj = steppo.spawn.start;
      const activityName = getActivityName(proj);
      const activityID = getActivityID(proj) || activityName;
      if (!accum[activityID]) {
        accum[activityID] = {
          count: 0,
          key: activityID,
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
      (!currentActivity.name ||
        !activityOptions.find(opt => opt.name === currentActivity.name)) &&
      activityOptions.length > 1 &&
      activityOptions[0].name
    ) {
      setCurrentActivity(activityOptions[0]);
    }
  }, [activityOptions, currentActivity]);
  const mappedTacticalActivities = mapTacticalActivitiesToID(
    tacticalActivities,
  );
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div id={'heatBoi'} />
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div style={{margin: 'auto 0'}}>
          <TacticalActivityIcon
            size={{
              width: 50,
              height: 50,
            }}
            tacticalActivity={mappedTacticalActivities[currentActivity.key]}
          />
        </div>
        <Select
          style={{margin: '0 1rem'}}
          value={currentActivity.name}
          onChange={event => {
            const nextSelection = activityOptions.find(
              option => option.name === event.target.value,
            );
            setCurrentActivity(nextSelection || activityOptions[0]);
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
        <div>
          <div id={'legend27'} />
          <div style={{display: 'flex'}}>
            <Typography>less</Typography>
            <Typography className={classes.legendLabel}>more</Typography>
          </div>
        </div>
      </div>
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
