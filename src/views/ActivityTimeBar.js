import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {connect} from "react-redux";
import Slide from "@material-ui/core/Slide";
import Close from '@material-ui/icons/Close';
import {startNonTimedActivity, startTimedActivity} from "../actions/ActivityActions";
import uuid from "uuid/v4";
import {ActivityTimedType, ActivityType, getActivityID, isActivityRecovery, RECOVERY} from "../types/ActivityModels";
import {PomodoroTimer} from "./PomodoroTimer";
import Stopwatch from "./Stopwatch";
import {blue} from "@material-ui/core/colors";
import {selectActivityState, selectTacticalState} from "../reducers";
import {TacticalActivityIcon} from "./TacticalActivityIcon";
import {createCompletedPomodoroEvent} from "../events/ActivityEvents";
import {TomatoIcon} from "./TomatoIcon";

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
    background: theme.palette.secondary.main
  },
  recovery: {
    background: blue[500]
  },
  close: {
    display: 'inline-flex',
    position: 'relative',
    cursor: 'pointer',
    paddingRight: theme.spacing(1)
  },
  activityIcon: {
    marginLeft: theme.spacing(1),
    opacity: 0.75,
  },
}));

export const getTime = antecedenceTime => Math.floor((new Date().getTime() - antecedenceTime || 0) / 1000);
const getTimerTime = (stopTime) => Math.floor((stopTime - new Date().getTime()) / 1000);

export const resumeActivity = (dispetch, previousActivity, currentActivity) => {
  dispetch(startTimedActivity({
    ...previousActivity.content,
    ...(previousActivity.content.duration ? {
      duration: Math.max(previousActivity.content.duration +
        (previousActivity.antecedenceTime - currentActivity.antecedenceTime), 0)
    } : {}),
    ...(previousActivity.content.workStartedWomboCombo ? {
      workStartedWomboCombo: Math.max(new Date().valueOf() -
        (currentActivity.antecedenceTime - previousActivity.content.workStartedWomboCombo), 0)
    } : {}),
    uuid: uuid(),
  }));
};

const ActivityTimeBar = ({
                           shouldTime,
                           currentActivity,
                           previousActivity,
                           pomodoroSettings,
                           activities,
                           numberOfCompletedPomodoro,
                           dispatch: dispetch
                         }) => {
  const classes = useStyles();
  const {antecedenceTime, content: {uuid: activityId, timedType, duration, name}} = currentActivity;

  const stopActivity = () => {
    dispetch(startNonTimedActivity({
      name: RECOVERY,
      type: ActivityType.ACTIVE,
      uuid: uuid(),
    }))
  };

  const startRecovery = () => {
    dispetch(startTimedActivity({
      name: RECOVERY,
      type: ActivityType.ACTIVE,
      timedType: ActivityTimedType.TIMER,
      duration: (numberOfCompletedPomodoro + 1) % 4 === 0 ?
        pomodoroSettings.longRecoveryDuration :
        pomodoroSettings.shortRecoveryDuration,
      uuid: uuid(),
    }));
  };

  const startPausedRecovery = () => {
    dispetch(startTimedActivity({
      name: RECOVERY,
      type: ActivityType.ACTIVE,
      timedType: ActivityTimedType.STOP_WATCH,
      uuid: uuid(),
    }));
  };

  const completedPomodoro = () => {
    if (name === RECOVERY) {
      resumePreviousActivity();
    } else {
      startRecovery();
      dispetch(createCompletedPomodoroEvent())
    }
  };

  function resumePreviousActivity() {
    dispetch(startTimedActivity({
      ...previousActivity.content,
      ...(previousActivity.content.duration ? {
        duration: pomodoroSettings.loadDuration
      } : {}),
      uuid: uuid(),
    }));
  }

  const startRecoveryOrResume = () => {
    if (name === RECOVERY) {
      resumePreviousActivity();
    } else {
      startRecovery();
    }
  };

  const isTimer = timedType === ActivityTimedType.TIMER;

  const isRecovery = isActivityRecovery(currentActivity);
  const getTimerBarClasses = () => {
    const timerBarClasses = [classes.timer];
    if (isRecovery) {
      timerBarClasses.push(classes.recovery)
    }
    return timerBarClasses.join(' ');
  };

  const tacticalActivity = activities[getActivityID(currentActivity)];

  const isTimeBarActivity = shouldTime && !(isRecovery && timedType === ActivityTimedType.STOP_WATCH);
  return isTimeBarActivity ? (
    <Slide direction={"up"} in={isTimeBarActivity}>
      <div className={getTimerBarClasses()}>
        {
          tacticalActivity &&
          <div className={classes.activityIcon}>
            <TacticalActivityIcon tacticalActivity={tacticalActivity} size={{
              width: '50px',
              height: '50px',
            }}/>
          </div>
        }
        {
          !tacticalActivity && isTimer && <TomatoIcon size={{
            width: '50px',
            height: '50px',
          }}/>
        }
        <div style={{flexGrow: 1, textAlign: "center"}}>
          {
            isTimer ?
              (
                <PomodoroTimer startTimeInSeconds={getTimerTime(antecedenceTime + duration)}
                               onComplete={completedPomodoro}
                               onPause={startPausedRecovery}
                               onBreak={startRecovery}
                               hidePause={isRecovery}
                               onResume={startRecoveryOrResume}
                               activityId={activityId}/>
              ) :
              <Stopwatch startTimeInSeconds={getTime(currentActivity.content.workStartedWomboCombo)}
                         onPause={startPausedRecovery}
                         activityId={activityId}/>
          }
        </div>
        {
          isTimer && (name !== RECOVERY) &&
          (<div className={classes.pomoCount}>
            <div style={{marginRight: '5px'}}>{numberOfCompletedPomodoro}:</div>
            <TomatoIcon size={{width: 24, height: 24}}/>
          </div>)
        }
        <div onClick={stopActivity} className={classes.close}>
          <Close/>
        </div>
      </div>
    </Slide>) : null;
};

const mapStateToProps = state => {
  const {currentActivity, previousActivity, shouldTime, completedPomodoro: {count}} = selectActivityState(state);
  const {pomodoro: {settings}, activity: {activities}} = selectTacticalState(state);
  return {
    shouldTime,
    currentActivity,
    previousActivity,
    pomodoroSettings: settings,
    activities,
    numberOfCompletedPomodoro: count
  }
};

export default connect(mapStateToProps)(ActivityTimeBar);
