import React, {FC, useEffect, useState} from 'react';
import range from 'lodash/range';
import {connect} from 'react-redux';
import {max, scaleSequential, select} from 'd3';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import {
  GlobalState,
  selectActivityState,
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
  RECOVERY,
} from '../../types/ActivityTypes';
import {NumberDictionary, StringDictionary} from '../../types/BaseTypes';
import {TacticalActivity} from '../../types/TacticalTypes';
import {Objective} from '../../types/StrategyTypes';
import {LinearProjection} from './LinearProjection';
import moment from 'moment';
import {MenuItem, Select} from '@material-ui/core';
import {mapTacticalActivitiesToID} from './PieFlavored';
import {ActivityProjection, constructProjection} from './Projections';
import {addCurrentActivity, constructColorMappings} from './TimeLine';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {TacticalActivityIcon} from '../icons/TacticalActivityIcon';
import Typography from '@material-ui/core/Typography';
import {blue} from '@material-ui/core/colors';
import {GENERIC_ACTIVITY_NAME} from '../time/ActivityHub';
import capitalize from '@material-ui/core/utils/capitalize';

export const RecoveryActivity: TacticalActivity = {
  id: RECOVERY,
  antecedenceTime: 69,
  categories: [],
  hidden: false,
  iconCustomization: {
    background: {
      hex: blue[500],
      opacity: 1,
    },
    line: {
      opacity: 1,
      hex: '#ffffff',
    },
  },
  name: 'Recovery',
  rank: -1,
};

const useStyles = makeStyles(theme => ({
  container: {
    borderTop: 'solid 1px rgba(0,0,0, .15)',
    paddingTop: '2rem',
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
  currentActivity: Activity;
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

    // todo: is this right?
    const safeSteps = fullSteps < 0 ? 0: fullSteps
    const fullTimeSteps = Array(Math.floor(safeSteps))
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

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  weekTimes = [
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

const margin = {top: 50, right: 0, bottom: 100, left: 30},
  width = 800 - margin.left - margin.right,
  gridSize = Math.floor(width / 24),
  minuteRow = Array(60).fill(0).map((_, i)=> ''),
  minuteColumn = Array(24).fill(0).map((_,i)=>'');

type HourSteppo = {
  spawn: { start: Activity; stop: Activity };
  hour: number;
  day: number;
  value: number;
};

const sanitizeName = (activityName: string): string => {
  return activityName === RECOVERY || activityName === GENERIC_ACTIVITY_NAME
    ? capitalize(activityName.toLowerCase())
    : activityName;
};

const HeatMap: FC<Props> = ({
                                    activityFeed,
                                    bottomActivity,
                                    currentActivity,
                                    relativeFromTime,
                                    relativeToTime,
                                    tacticalActivities,
                                    archivedActivities,
                                  }) => {
  const [filteredLinearProjection, setFilteredLinearProjection] = useState<HourSteppo[]>([]);
  const [linearProjection, setLinearProjection] = useState<HourSteppo[]>([]);

  const [currentHeatMapActivity, setCurrentHeatMapActivity] = useState<{
    name: string;
    displayName: string;
    key: string;
    count: number;
  }>({
    name: '',
    displayName: '',
    key: '',
    count: 0,
  });

  const [heatMapType, setHeatMapType] = useState('hour');

  useEffect(() => {
    const selection = select('#dayHeatBoi');
    selection.select('svg').remove();

    const isHour = heatMapType==='hour';
    const rows = isHour ? weekDays : minuteRow;
    const height = (gridSize * (rows.length + 3)) - margin.top - margin.bottom;

    const heatBoiSvg = selection
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


    heatBoiSvg
      .selectAll('.dayLabel')
      .data(rows)
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
      .data(isHour ? weekTimes : minuteColumn)
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

    const newestActivity = activityFeed[0];
    if (
      !activitiesEqual(newestActivity, currentActivity) &&
      currentActivity &&
      currentActivity !== DEFAULT_ACTIVITY &&
      (newestActivity &&
        newestActivity.antecedenceTime < currentActivity.antecedenceTime)
    ) {
      const antecedenceTime =
        currentActivity.antecedenceTime > relativeToTime
          ? relativeToTime - (relativeToTime % 86400000)
          : currentActivity.antecedenceTime;
      const modifiedTop: Activity = {
        ...currentActivity,
        antecedenceTime: antecedenceTime,
      };
      modifiedFeed.unshift(modifiedTop);
    }

    const projection = constructProjection(modifiedFeed);
    addCurrentActivity(projection, relativeToTime);
    const linearProj: LinearProjection = {
      currentActivity: projection.currentActivity,
      activityBins: Object.values(projection.activityBins).flatMap(a => a),
    };
    const multiplier = isHour ? 3600000 : 60000; // Hello everybody! My name is Multiplier.
    const unfilteredSteppos = breakIntoHeatSteps(linearProj,  multiplier);
    const filterdSteppos = unfilteredSteppos.filter(
      steppo =>
        !currentHeatMapActivity ||
        currentHeatMapActivity.name === getActivityName(steppo.spawn.start),
    );
    const timeSteppoMaker = (steppo: {
      timeStamp: number;
      value: number;
      spawn: any;
    }) => {
      const dateTime = moment.unix(steppo.timeStamp / 1000);
      const absTime = (dateTime.hour() * 60) + (dateTime.minutes())
      return {
        day: isHour ? dateTime.day() : Math.floor(absTime / 24),
        hour: isHour ? dateTime.hour() : absTime % 24,
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

    // for the labels and such
    const sillyAdditionThing = isHour ? 1 : 0;

    const completeTaskProjection = Object.entries<StringDictionary<number>>(
      weekProjection,
    ).flatMap(dayEntry =>
      Object.entries(dayEntry[1]).map(hourEntry => ({
        day: +dayEntry[0] + sillyAdditionThing,
        hour: +hourEntry[0] + sillyAdditionThing,
        value: hourEntry[1],
      })),
    );

    const completeGrid = [];
    const numberOfGrids = isHour ? 7 * 24 : 60 * 24;
    for (let i = 0, j = 0; i < numberOfGrids; i++) {
      const actualTimeOnTask = completeTaskProjection[j];
      if(actualTimeOnTask && (((actualTimeOnTask.day - sillyAdditionThing) * 24) +
        actualTimeOnTask.hour - sillyAdditionThing) === i){
        completeGrid.push(actualTimeOnTask);
        j++;
      } else {
        completeGrid.push({
          day: Math.floor(i / 24) + sillyAdditionThing,
          hour: i % 24 + sillyAdditionThing,
          value: 0,
        })
      }
    }
    const steps = completeGrid;

    const mappedTacticalActivities: StringDictionary<TacticalActivity> = {
      ...mapTacticalActivitiesToID(tacticalActivities),
      ...archivedActivities,
      [RECOVERY]: RecoveryActivity,
    };

    const almostMaxValue = max(steps, s => +s.value) || 1;
    const maxValue = almostMaxValue < 1 ? 1 : almostMaxValue;
    const domain: [number, number] = [0, maxValue];
    const colorMappings = constructColorMappings(mappedTacticalActivities);
    const colorScale = (_: number) => colorMappings[currentHeatMapActivity.key];
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
      .attr('stroke', d => d.value === 0 ? '#eeeeee55' : '#00000000')
      .style('fill', d => {
        const opacity = Math.round((opacityScale(d.value) - 0.01) * 255) || 1;
        return `${colorScale(d.value)}${opacity < 16 ? 0 : ''}${opacity.toString(16)}`;
      })
      .append('title')
      .text((d: any) => {
        const duration = moment.duration(d.value * multiplier).humanize()
        const currentTime = moment.unix((((d.day) * 24) + d.hour) * 60).utc();
        const timeOfDay = `Time of day: ${currentTime.format('HH:mm')}`;
        return `${isHour ? '' : timeOfDay}
Duration: ${!d.value ? 'N/A' : duration}`;
      });

    const legend = select('#legend69');
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
    currentHeatMapActivity,
    filteredLinearProjection,
    relativeFromTime,
    relativeToTime,
    tacticalActivities,
    heatMapType,
  ]);

  const activityToSteppoCount = linearProjection.reduce(
    (accum: StringDictionary<any>, steppo) => {
      const proj = steppo.spawn.start;
      const activityName = getActivityName(proj);
      const activityID = getActivityID(proj) || activityName;
      if (!accum[activityID]) {
        accum[activityID] = {
          count: 0,
          displayName: sanitizeName(activityName),
          key: activityID,
        };
      }
      const accumElement = accum[activityID];
      accum[activityID] = {
        ...accumElement,
        name: activityName,
        count: accumElement.count + steppo.value,
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
      (!currentHeatMapActivity.name ||
        !activityOptions.find(
          opt => opt.name === currentHeatMapActivity.name,
        )) &&
      activityOptions.length > 1 &&
      activityOptions[0].name
    ) {
      setCurrentHeatMapActivity(activityOptions[0]);
    }
  }, [activityOptions, currentHeatMapActivity]);

  const mappedTacticalActivities = mapTacticalActivitiesToID({
    ...tacticalActivities,
    9001: RecoveryActivity,
  });
  const classes = useStyles();
  const changeChart = (e: any) => {
    setHeatMapType(e.target.value);
  }
  return (
    <div className={classes.container}>
      {!!currentHeatMapActivity.name && (
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Activity by: </FormLabel>
            <RadioGroup row aria-label="position" name="position" onChange={changeChart} defaultValue="hour">
              <FormControlLabel
                value="minute"
                control={<Radio color="primary" />}
                label="Minute"
                labelPlacement="start"
              />
              <FormControlLabel
                value="hour"
                control={<Radio color="primary" />}
                label="Hour"
                labelPlacement="start"
              />
            </RadioGroup>
          </FormControl>
          <div style={{margin: 'auto 0 auto 1rem'}}>
            <TacticalActivityIcon
              size={{
                width: 50,
                height: 50,
              }}
              tacticalActivity={
                mappedTacticalActivities[currentHeatMapActivity.key]
              }
            />
          </div>
          <Select
            style={{margin: '0 1rem'}}
            value={currentHeatMapActivity.displayName}
            onChange={event => {
              const nextSelection = activityOptions.find(
                option => option.displayName === event.target.value,
              );
              setCurrentHeatMapActivity(nextSelection || activityOptions[0]);
            }}>
            {activityOptions.map(value => {
              return (
                <MenuItem
                  key={value.key || new Date().valueOf().toString(16)}
                  value={value.displayName}>
                  {value.displayName}
                </MenuItem>
              );
            })}
          </Select>
          <div>
            <div id={'legend69'}/>
            <div style={{display: 'flex'}}>
              <Typography>less</Typography>
              <Typography className={classes.legendLabel}>more</Typography>
            </div>
          </div>
        </div>
      )}
      <div id={'dayHeatBoi'}/>
    </div>
  );
};

const mapStateToProps = (state: GlobalState): Props => {
  const {
    activityFeed,
    selectedHistoryRange: {to, from},
    capstone: {bottomActivity},
  } = selectHistoryState(state);
  const {currentActivity} = selectActivityState(state);
  const {objectives} = selectStrategyState(state);
  const {activities, archivedActivities} = selectTacticalActivityState(state);
  return {
    activityFeed,
    currentActivity,
    relativeToTime: to,
    relativeFromTime: from,
    tacticalActivities: activities,
    archivedActivities,
    bottomActivity,
    objectives,
  };
};

export default connect(mapStateToProps)(HeatMap);
