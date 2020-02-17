import * as React from 'react';
import {FC, useEffect} from 'react';
import {select} from 'd3-selection';
import {scaleLinear} from 'd3-scale';
import {axisTop, brushX, event} from 'd3';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {getActivityIdentifier} from '../../miscellanous/Projection';
import {
  GlobalState,
  selectActivityState,
  selectHistoryState,
  selectTacticalActivityState,
} from '../../reducers';
import {connect, useDispatch} from 'react-redux';
import {objectToKeyValueArray} from '../../miscellanous/Tools';
import {getMeaningFullName, mapTacticalActivitiesToID} from './PieFlavored';
import {createAdjustedHistoryTimeFrame} from '../../events/HistoryEvents';
import {blue} from '@material-ui/core/colors';
import {NumberDictionary, StringDictionary} from '../../types/BaseTypes';
import {
  getActivityBackgroundColor,
  TacticalActivity,
} from '../../types/TacticalTypes';
import {
  activitiesEqual,
  Activity,
  ActivityStrategy,
  DEFAULT_ACTIVITY,
  getActivityID,
  getActivityName,
  RECOVERY,
} from '../../types/ActivityTypes';
import reduceRight from 'lodash/reduceRight';
import {constructProjection} from './Projections';

const withStyles = makeStyles(__ => ({
  timeBar: {
    fillOpacity: 1,
    strokeWidth: 6,
  },
}));

export const constructColorMappings = (
  tacticalActivities: StringDictionary<TacticalActivity>,
): StringDictionary<string> => {
  const defaultColors: StringDictionary<string> = {};
  defaultColors[ActivityStrategy.GENERIC] = 'lime';
  defaultColors[RECOVERY] = blue[500];
  return {
    ...reduceRight(
      objectToKeyValueArray(tacticalActivities)
        .map(kv => ({key: kv.key, value: getActivityBackgroundColor(kv.value)}))
        .filter(kv => !!kv.value),
      (accum: StringDictionary<string>, idToColor) => {
        accum[idToColor.key] = idToColor.value;
        return accum;
      },
      {},
    ),
    ...defaultColors,
  };
};

export const responsivefy = (svg: any) => {
  const resize = () => {
    const targetWidth = parseInt(container.style('width'), 10);
    svg.attr('width', targetWidth);
    svg.attr('height', Math.round(targetWidth / aspect));
  };

  const container = select(svg.node().parentNode),
    width = parseInt(svg.style('width'), 10),
    height = parseInt(svg.style('height'), 10),
    aspect = width / height;

  svg
    .attr('viewBox', `0 0 ${width}  ${height}`)
    .attr('perserveAspectRatio', 'xMinYMid')
    .call(resize);

  select(window).on('resize.' + container.attr('id'), resize);
};

const NINETY_MINUTES = 5400000;
const getTimeUnit = (milliseconds: number) => {
  if (milliseconds / NINETY_MINUTES > 1) {
    return `${(milliseconds / 3600000).toFixed(2)} hours`;
  } else {
    return `${(milliseconds / 60000).toFixed(2)} minutes`;
  }
};

type Props = {
  activityFeed: Activity[];
  archivedActivities: StringDictionary<TacticalActivity>;
  bottomActivity: Activity;
  currentActivity: Activity;
  relativeToTime: number;
  tacticalActivities: NumberDictionary<TacticalActivity>;
  relativeFromTime: number;
};
const mapStateToProps = (state: GlobalState): Props => {
  const {
    activityFeed,
    selectedHistoryRange: {to, from},
    capstone: {bottomActivity},
  } = selectHistoryState(state);
  const {activities, archivedActivities} = selectTacticalActivityState(state);
  const {currentActivity} = selectActivityState(state);
  return {
    activityFeed,
    relativeToTime: to,
    relativeFromTime: from,
    tacticalActivities: activities,
    archivedActivities,
    currentActivity,
    bottomActivity,
  };
};

const TimeLine: FC<Props> = ({
  activityFeed,
  relativeToTime,
  relativeFromTime,
  tacticalActivities,
  currentActivity,
  bottomActivity,
  archivedActivities,
}) => {
  const classes: any = withStyles();
  const dispatch = useDispatch();

  const modifiedFeed = [
    ...(currentActivity.antecedenceTime >= relativeFromTime &&
    currentActivity.antecedenceTime <= relativeToTime
      ? [currentActivity]
      : []),
    ...activityFeed,
  ];
  const earliestActivity = modifiedFeed[modifiedFeed.length - 1];
  if (
    !activitiesEqual(earliestActivity, bottomActivity) &&
    bottomActivity &&
    bottomActivity !== DEFAULT_ACTIVITY &&
    (earliestActivity &&
      earliestActivity.antecedenceTime >= bottomActivity.antecedenceTime)
  ) {
    modifiedFeed.push(bottomActivity);
  }

  const activityProjection = constructProjection(modifiedFeed);

  const bins = activityProjection.activityBins;
  const activityIdentifier = getActivityIdentifier(
    activityProjection.currentActivity,
  );
  if (!bins[activityIdentifier]) {
    bins[activityIdentifier] = [];
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
        ...DEFAULT_ACTIVITY,
        antecedenceTime: meow.valueOf(),
      },
    },
  });

  useEffect(() => {
    if (modifiedFeed.length) {
      const selection = select('#timeBoi');

      const binsToArray = objectToKeyValueArray(bins);
      const lanes = binsToArray.map(kV => kV.key);

      const laneLength = lanes.length;
      const margin = {
        left: 20,
        right: 15,
        top: 40,
        bottom: 15,
      };

      const width = 2500 - margin.left - margin.right;
      const height = 350 - margin.top - margin.bottom;

      const timeBegin = relativeFromTime;
      const timeEnd = relativeToTime;

      const x = scaleLinear()
        .domain([0, timeEnd - timeBegin])
        .range([0, width]);
      const y1 = scaleLinear()
        .domain([0, laneLength + 1])
        .range([0, height - margin.top - margin.bottom]);

      selection.select('svg').remove();

      const timeSVG = selection
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .call(responsivefy);

      const timeLabelAxis = axisTop(x).tickFormat((d, i) => {
        if (i === 0 || i === 12) {
          return '';
        }

        const dateBoi = new Date(relativeFromTime + d.valueOf());
        const trailingZero = (number: number) => (number / 10 < 1 ? 0 : '');
        const convertToPretty = (numberDude: number) =>
          `${trailingZero(numberDude)}${numberDude}`;
        const hours = convertToPretty(dateBoi.getHours());
        const minutes = convertToPretty(dateBoi.getMinutes());
        return `${hours}:${minutes}`;
      });

      timeSVG
        .append('g')
        .attr('transform', `translate(0,${margin.top})`)
        .call(timeLabelAxis)
        .attr('font-size', 'xx-large')
        .attr('color', 'black');

      timeSVG
        .append('defs')
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', width)
        .attr('height', height);

      const items = binsToArray.flatMap((keyValue, index) => {
        keyValue.value.forEach(activity => {
          activity.lane = index;
          activity.start = activity.start - timeBegin;
          activity.start = activity.start < 0 ? 0 : activity.start;
          activity.stop = activity.stop - timeBegin;
        });
        return keyValue.value;
      });

      const mappedTacticalActivities = {
        ...mapTacticalActivitiesToID(tacticalActivities),
        ...archivedActivities,
      };
      const colorToActivity = constructColorMappings(mappedTacticalActivities);

      timeSVG
        .append('g')
        .selectAll('.timeBar')
        .data(items)
        .enter()
        .append('rect')
        .attr('transform', `translate(0,${margin.top})`)
        .attr('fill', d => colorToActivity[getActivityID(d.spawn.start)])
        .attr('opacity', 0.7)
        .attr('class', () => classes.timebar)
        .attr('x', d => x(d.start))
        .attr('y', (d: any) => y1(d.lane) + 10)
        .attr('width', d => x(d.stop - d.start))
        .attr('height', () => y1(1))
        .append('title')
        .text(d => {
          const meaningFullName = getMeaningFullName(
            d.activityIdentifier,
            mappedTacticalActivities,
          );
          const millisecondsDuration =
            d.spawn.stop.antecedenceTime - d.spawn.start.antecedenceTime;
          return `${meaningFullName}: ${getTimeUnit(millisecondsDuration)} `;
        });

      const brushEnd = (bBoi: any, bBoiSelection: any) => {
        if (!event.sourceEvent || !event.selection) {
          return;
        }
        bBoi.clear(bBoiSelection);
        const [newFrom, newTo] = event.selection
          .map(x.invert)
          .map((n: any) => n + relativeFromTime);

        dispatch(
          createAdjustedHistoryTimeFrame({
            from: newFrom,
            to: newTo,
          }),
        );
      };

      const bBoi = brushX().extent([[0, 0], [width, height]]);
      const bBoiSelection = timeSVG.append('g');
      bBoiSelection
        .attr('id', 'bboi')
        .attr('class', 'brush')
        .call(bBoi.on('end', () => brushEnd(bBoi, bBoiSelection)));
    }
  }, [
    archivedActivities,
    bins,
    classes.timebar,
    dispatch,
    modifiedFeed,
    relativeFromTime,
    relativeToTime,
    tacticalActivities,
  ]);

  return (
    <div style={{height: '100%'}}>
      <div
        style={{
          height: '100%',
          margin: 'auto 0',
        }}
        id={'timeBoi'}
      />
    </div>
  );
};

export default connect(mapStateToProps)(TimeLine);
