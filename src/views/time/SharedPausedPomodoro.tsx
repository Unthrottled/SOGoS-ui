import * as React from 'react';
import {useSelector} from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {GlobalState, selectActivityState, selectTacticalActivityState,} from '../../reducers';
import Stopwatch from './Stopwatch';
import {blue, green} from '@material-ui/core/colors';
import {numberObjectToArray} from '../../miscellanous/Tools';
import {dictionaryReducer} from '../../reducers/StrategyReducer';
import {TacticalActivityIcon} from '../icons/TacticalActivityIcon';
import {TacticalActivity} from '../../types/TacticalTypes';
import {ActivityTimedType, getActivityID, isActivityRecovery, isPausedActivity,} from '../../types/ActivityTypes';
import {StringDictionary} from '../../types/BaseTypes';
import Slide from "@material-ui/core/Slide";
import {Typography} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  pomoCount: {
    display: 'flex',
  },
  timer: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    display: 'flex',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    zIndex: 69,
    background: green[500],
  },
  recovery: {
    background: blue[500],
  },
  close: {
    display: 'inline-flex',
    position: 'relative',
    cursor: 'pointer',
    paddingRight: theme.spacing(1),
  },
  activityIcon: {
    lineHeight: 1,
    marginLeft: theme.spacing(1),
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

const SharedPausedPomodoro = () => {
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

  const mappedTacticalActivities: StringDictionary<TacticalActivity> = numberObjectToArray(activities).reduce(dictionaryReducer, {});
  const tacticalActivity =
    mappedTacticalActivities[getActivityID(currentActivity)];

  const isRecovery = isActivityRecovery(currentActivity);
  const getTimerBarClasses = () => {
    const timerBarClasses = [classes.timer];
    if (isRecovery) {
      timerBarClasses.push(classes.recovery);
    }
    return timerBarClasses.join(' ');
  };


  const isPausedPomodoro =
    shouldTime &&
    isPausedActivity(currentActivity) &&
    timedType === ActivityTimedType.STOP_WATCH;

  return isPausedPomodoro ? (
    <Slide direction={'up'} in={isPausedPomodoro}>
      <div className={getTimerBarClasses()}>
        {tacticalActivity && (<>
            <div className={classes.activityIcon}>
              <TacticalActivityIcon
                tacticalActivity={tacticalActivity}
                size={{
                  width: '50px',
                  height: '50px',
                }}
              />
            </div>
            <Typography style={{
              margin: 'auto 0 auto 0.5rem',
            }}>
              {tacticalActivity.name}
            </Typography>
          </>
        )}
        <div style={{flexGrow: 1, textAlign: 'center', marginTop: '0.5rem'}}>
          <Stopwatch readOnly/>
        </div>
      </div>
    </Slide>
  ) : null;
};

export default SharedPausedPomodoro;
