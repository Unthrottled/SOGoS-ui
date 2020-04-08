import * as React from 'react';
import {FC, useEffect} from 'react';
import {select} from 'd3-selection';
import {arc, pie} from 'd3';
import {connect} from 'react-redux';
import {
  GlobalState,
  selectHistoryState,
  selectStrategyState,
  selectTacticalActivityState,
  selectUserState,
} from '../../reducers';
import {numberObjectToArray, objectToKeyValueArray,} from '../../miscellanous/Tools';
import {areDifferent, getActivityIdentifier, shouldTime,} from '../../miscellanous/Projection';
import {constructColorMappings} from './TimeLine';
import {dictionaryReducer} from '../../reducers/StrategyReducer';
import {TacticalActivity} from '../../types/TacticalTypes';
import {HasId, NumberDictionary, StringDictionary} from '../../types/BaseTypes';
import {activitiesEqual, Activity, DEFAULT_ACTIVITY, getActivityName, RECOVERY,} from '../../types/ActivityTypes';
import reduceRight from 'lodash/reduceRight';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import {TacticalActivityIcon} from '../icons/TacticalActivityIcon';
import {Objective} from '../../types/StrategyTypes';
import moment from 'moment';
import {RecoveryActivity} from './HeatMap';
import capitalize from "@material-ui/core/utils/capitalize";

export const getMeaningFullName = (
  activityId: string,
  tacticalActivities: StringDictionary<TacticalActivity>,
) => {
  const tacticalActivity: TacticalActivity = tacticalActivities[activityId];
  return (tacticalActivity && tacticalActivity.name) || activityId;
};

export const responsivefy = (svg: any) => {
  const container = select(svg.node().parentNode),
    width = parseInt(svg.style('width'), 10),
    height = parseInt(svg.style('height'), 10),
    aspect = width / height;
  svg.attr('perserveAspectRatio', 'xMinYMid').call(resize);

  select(window).on('resize.' + container.attr('id'), resize);

  function resize() {
    const targetWidth = parseInt(container.style('width'), 10);
    svg.attr('width', targetWidth);
    const heightBoi = Math.round(targetWidth / aspect);
    svg.attr('height', heightBoi);
  }
};

export const mapTacticalActivitiesToID = <T extends HasId>(
  tacticalActivities: NumberDictionary<T>,
): StringDictionary<T> =>
  numberObjectToArray(tacticalActivities).reduce(dictionaryReducer, {});

interface Props {
  activityFeed: Activity[];
  relativeToTime: number;
  relativeFromTime: number;
  tacticalActivities: NumberDictionary<TacticalActivity>;
  bottomActivity: Activity;
  archivedActivities: NumberDictionary<TacticalActivity>;
  objectives: StringDictionary<Objective>;
  firstName: string;
}

interface GroupedActivity {
  activityName: string;
  activityIdentifier: string;
  duration: number;
  spawn: Activity;
}

interface ProjectionReduction {
  trackedTime: number;
  currentActivity: Activity;
  activityBins: StringDictionary<GroupedActivity[]>;
}

function addCurrentActivityToProjection(
  activityProjection: ProjectionReduction,
  relativeToTime: number,
) {
  const bins = activityProjection.activityBins;
  const activityIdentifier = getActivityIdentifier(
    activityProjection.currentActivity,
  );
  if (!bins[activityIdentifier]) {
    bins[activityIdentifier] = [];
  }

  const activityName = getActivityName(activityProjection.currentActivity);
  const meow = new Date().getTime();
  const capTime = meow < relativeToTime ? meow : relativeToTime;
  const duration = capTime - activityProjection.trackedTime;
  bins[activityIdentifier].push({
    activityName,
    activityIdentifier,
    duration,
    spawn: activityProjection.currentActivity,
  });
  return bins;
}

function createActivity(mappedTacticalActivities: StringDictionary<TacticalActivity>) {
  return (data: any) => {
    const activity = mappedTacticalActivities[data.name];
    return (
      <div key={data.name} style={{display: 'flex'}}>
        <div style={{marginRight: '1rem'}}>
          <TacticalActivityIcon
            tacticalActivity={activity}
            size={{
              width: 25,
              height: 25,
            }}
          />
        </div>
        <Typography style={{margin: 'auto 0'}}>
          {getMeaningFullName(data.name, mappedTacticalActivities)}:{' '}
          <strong>{(data.value / 3600000).toFixed(3)}</strong> hours
          or <i>about {moment.duration(data.value).humanize()}</i>
        </Typography>
      </div>
    );
  };
}

const PieFlavored: FC<Props> = ({
                                  activityFeed,
                                  relativeToTime,
                                  relativeFromTime,
                                  tacticalActivities,
                                  bottomActivity,
                                  archivedActivities,
                                  firstName,
                                }) => {
  const activityProjection: ProjectionReduction = reduceRight(
    activityFeed,
    (accum: ProjectionReduction, activity: Activity) => {
      if (accum.trackedTime < 0) {
        accum.trackedTime =
          activity.antecedenceTime < relativeFromTime
            ? relativeFromTime
            : activity.antecedenceTime;
      }

      if (shouldTime(activity) && !accum.currentActivity.antecedenceTime) {
        accum.currentActivity = activity;
      } else if (
        areDifferent(accum.currentActivity, activity) &&
        shouldTime(activity)
      ) {
        // Different Type: Create workable chunk and start next activity.
        const currentActivity = accum.currentActivity;
        accum.currentActivity = activity;
        const adjustedAntecedenceTime =
          activity.antecedenceTime < relativeFromTime
            ? relativeFromTime
            : activity.antecedenceTime;
        const duration = adjustedAntecedenceTime - accum.trackedTime;
        accum.trackedTime = activity.antecedenceTime;
        const activityName: string = getActivityName(currentActivity);
        const activityIdentifier = getActivityIdentifier(currentActivity);
        if (!accum.activityBins[activityIdentifier]) {
          accum.activityBins[activityIdentifier] = [];
        }
        accum.activityBins[activityIdentifier].push({
          activityName,
          activityIdentifier,
          duration,
          spawn: currentActivity,
        });
      }
      return accum;
    },
    {
      trackedTime: -1,
      currentActivity: DEFAULT_ACTIVITY,
      activityBins: {},
    },
  );

  const bins = addCurrentActivityToProjection(
    activityProjection,
    relativeToTime,
  );

  const bottomCapActivity: Activity = bottomActivity;
  const earliestActivity: Activity = activityFeed[activityFeed.length - 1];
  if (
    !activitiesEqual(earliestActivity, bottomCapActivity) &&
    earliestActivity &&
    (earliestActivity &&
      earliestActivity.antecedenceTime >= bottomActivity.antecedenceTime)
  ) {
    const bottomActivityIdentifier = getActivityIdentifier(bottomCapActivity);
    if (!bins[bottomActivityIdentifier]) {
      bins[bottomActivityIdentifier] = [];
    }
    const bottomCapActivityName = getActivityName(bottomCapActivity);
    const bottomTime =
      bottomCapActivity.antecedenceTime < relativeFromTime
        ? relativeFromTime
        : bottomCapActivity.antecedenceTime;
    const bottomDuration = earliestActivity.antecedenceTime - bottomTime;
    bins[bottomActivityIdentifier].push({
      activityName: bottomCapActivityName,
      activityIdentifier: bottomActivityIdentifier,
      duration: bottomDuration,
      spawn: bottomActivity,
    });
  }

  const pieData = reduceRight(
    objectToKeyValueArray(bins),
    (accum: { name: string; value: number }[], keyValue) => {
      accum.push({
        name: keyValue.key,
        value: keyValue.value.reduce(
          (kvAccum, binBoi) => kvAccum + binBoi.duration,
          0,
        ),
      });
      return accum;
    },
    [],
  );

  const totalTime = pieData.reduceRight((accum, b) => accum + b.value, 0);
  const mappedTacticalActivities: StringDictionary<TacticalActivity> = {
    ...mapTacticalActivitiesToID(tacticalActivities),
    ...archivedActivities,
    [RECOVERY]: RecoveryActivity,
  };

  useEffect(() => {
    if (activityFeed.length > 0) {
      const selection = select('#pieBoi');
      const width = 300;
      const height = 300;

      selection.select('svg').remove();

      const pieSVG = selection
        .append('svg')
        // @ts-ignore real
        .attr('viewBox', [-width / 2, -height / 2, width, height])
        .call(responsivefy)
        .append('g');

      const pieFlavored = pie()
        .padAngle(0.005)
        .sort(null)
        // @ts-ignore real
        .value(d => d.value);

      // @ts-ignore real
      const arcs = pieFlavored(pieData);

      const radius = Math.min(width, height) / 2;
      const arcThing = arc()
        .innerRadius(0)
        .outerRadius(radius - 1);

      const idToColor = constructColorMappings(mappedTacticalActivities);

      pieSVG
        .selectAll('path')
        .data(arcs)
        .join('path')
        .attr('fill', (d: any) => idToColor[d.data.name])
        .attr('opacity', 0.7)
        .attr('d', (d: any) => arcThing(d))
        .append('title')
        .text(
          (d: any) =>
            `${getMeaningFullName(d.data.name, mappedTacticalActivities)}: ${(
              (d.data.value / totalTime) *
              100
            ).toFixed(2)}% or ${moment.duration(d.data.value).humanize()}`,
        );
    }
  });

  const orderedPieData = [...pieData].sort((a, b) => b.value - a.value);

  return (
    <div>
      <div style={{display: 'flex'}}>
        <div style={{margin: '1rem 0 0 1rem'}}>
          <hr style={{opacity: 0.4}}/>
          <Typography variant={'h6'} gutterBottom={true}>
            {capitalize(firstName)}'s Top 5 Activities
          </Typography>
          <hr style={{opacity: 0.4}}/>
          <div>
            {orderedPieData.slice(0, 5).map(createActivity(mappedTacticalActivities))}
          </div>
        </div>
        <div
          style={{
            maxWidth: '350px',
            minHeight: '350px',
            margin: 'auto',
          }}
          id={'pieBoi'}
        >
          <div style={{width: '300px', marginTop: '-1.5rem', opacity: 0}}>Hi!</div>
        </div>
      </div>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon/>}
          aria-controls="panel1a-content"
          id="panel1a-header">
          <div style={{margin: 'auto'}}>
            <Typography>Full Activity Breakdown</Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}>
            {orderedPieData.map(createActivity(mappedTacticalActivities))}
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
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
  const {
    information: {firstName},
  } = selectUserState(state);

  return {
    activityFeed,
    relativeToTime: to,
    relativeFromTime: from,
    tacticalActivities: activities,
    archivedActivities,
    bottomActivity,
    objectives,
    firstName,
  };
};
export default connect(mapStateToProps)(PieFlavored);
