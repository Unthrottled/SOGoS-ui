import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import Stop from '@material-ui/icons/Stop';
import {
  GlobalState,
  selectActivityState,
  selectTacticalActivityState,
} from '../../reducers';
import Stopwatch from './Stopwatch';
import {resumeActivity} from './ActivityTimeBar';
import uuid from 'uuid/v4';
import IconButton from '@material-ui/core/IconButton';
import {green} from '@material-ui/core/colors';
import {numberObjectToArray} from '../../miscellanous/Tools';
import {dictionaryReducer} from '../../reducers/StrategyReducer';
import {TacticalActivityIcon} from '../icons/TacticalActivityIcon';
import {GENERIC_ACTIVITY_NAME} from './ActivityHub';
import {TacticalActivity} from '../../types/TacticalTypes';
import {
  ActivityTimedType,
  ActivityType,
  getActivityID,
  getActivityName,
  isPausedActivity,
  RECOVERY,
} from '../../types/ActivityTypes';
import {startNonTimedActivity} from '../../actions/ActivityActions';
import {StringDictionary} from '../../types/BaseTypes';

const useStyles = makeStyles(theme => ({
  container: {
    background: 'rgba(0,0,0,0.9)',
    position: 'fixed',
    top: '0',
    width: '100%',
    zIndex: 10000,
    height: '100%',
  },
  contents: {
    top: '30%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  stopWatch: {
    margin: 'auto',
  },
  icon: {
    fontSize: '5em',
    color: green[500],
  },
  cancel: {},
  cancelIcon: {
    fontSize: '1.25em',
    color: 'red',
    background: 'rgba(240, 0,0,0.25)',
    borderRadius: '50%',
    padding: theme.spacing(0.5),
  },
  pivotContainer: {
    marginTop: theme.spacing(1),
  },
  pivotLabel: {
    display: 'flex',
    marginBottom: theme.spacing(1),
    justifyContent: 'center',
    fontSize: '1.5em',
  },
}));

const mapStateToProps = (state: GlobalState) => {
  const {currentActivity, previousActivity, shouldTime} = selectActivityState(
    state,
  );
  const {activities} = selectTacticalActivityState(state);
  return {
    shouldTime,
    currentActivity,
    previousActivity,
    activities,
  };
};

const PausedPomodoro = () => {
  const classes: any = useStyles();
  const {
    shouldTime,
    currentActivity,
    previousActivity,
    activities,
  } = useSelector(mapStateToProps);
  const {
    content: {timedType},
  } = currentActivity;

  const mappedTacticalActivities: StringDictionary<
    TacticalActivity
  > = numberObjectToArray(activities).reduce(dictionaryReducer, {});
  const tacticalActivity =
    mappedTacticalActivities[getActivityID(currentActivity)];

  const dispetch = useDispatch();
  const stopActivity = () => {
    dispetch(
      startNonTimedActivity({
        name: RECOVERY,
        type: ActivityType.ACTIVE,
        timedType: ActivityTimedType.NONE,
        uuid: uuid(),
      }),
    );
  };

  const resumePreviousActivity = () => {
    resumeActivity(dispetch, previousActivity, currentActivity);
  };

  const isPausedPomodoro =
    shouldTime &&
    isPausedActivity(currentActivity) &&
    timedType === ActivityTimedType.STOP_WATCH;
  return isPausedPomodoro ? (
    <div className={classes.container}>
      <div className={classes.contents}>
        <div className={classes.stopWatch} />
        <div className={classes.stopwatch}>
          <Stopwatch fontSize={'2em'} />
        </div>
        <div className={classes.stopWatch}>
          <IconButton color={'inherit'} onClick={resumePreviousActivity}>
            <PlayCircleFilled id={'paused-pomodoro'} className={classes.icon} />
          </IconButton>
          <IconButton
            className={classes.cancel}
            color={'inherit'}
            onClick={stopActivity}>
            <Stop className={classes.cancelIcon} />
          </IconButton>
        </div>
        {(tacticalActivity ||
          getActivityName(currentActivity) === GENERIC_ACTIVITY_NAME) && (
          <div className={classes.pivotContainer}>
            <div className={classes.pivotLabel}>
              <div>
                Pivoted to: {getActivityName(currentActivity).replace(/_/, ' ')}{' '}
              </div>
            </div>
            {tacticalActivity && (
              <TacticalActivityIcon tacticalActivity={tacticalActivity} />
            )}
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default PausedPomodoro;
