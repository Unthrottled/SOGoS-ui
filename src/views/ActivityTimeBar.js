import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {connect} from "react-redux";
import Slide from "@material-ui/core/Slide";
import Close from '@material-ui/icons/Close';
import {startNonTimedActivity, startTimedActivity} from "../actions/ActivityActions";
import uuid from "uuid/v4";
import {ActivityTimedType, ActivityType, isActivityRecovery, RECOVERY} from "../types/ActivityModels";
import {PomodoroTimer} from "./PomodoroTimer";
import Stopwatch from "./Stopwatch";
import {blue} from "@material-ui/core/colors";
import {selectActivityState, selectTacticalState} from "../reducers";

const useStyles = makeStyles(theme => ({
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
}));

export const getTime = antecedenceTime => Math.floor((new Date().getTime() - antecedenceTime || 0) / 1000);
const getTimerTime = (stopTime) => Math.floor((stopTime - new Date().getTime()) / 1000);

export const resumeActivity = (dispetch, previousActivity, currentActivity) => {
  dispetch(startTimedActivity({
    ...previousActivity.content,
    duration: previousActivity.content.duration +
      previousActivity.antecedenceTime - currentActivity.antecedenceTime,
    uuid: uuid(),
  }));
};

const ActivityTimeBar = ({
                           shouldTime,
                           currentActivity,
                           previousActivity,
                           pomodoroSettings,
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
      duration: pomodoroSettings.shortRecoveryDuration,
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

  const startRecoveryOrResume = () => {
    if (name === RECOVERY) {
      resumeActivity(dispetch, previousActivity, currentActivity);
    } else {
      startRecovery()
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

  const isTimeBarActivity = shouldTime && !(isRecovery && timedType===ActivityTimedType.STOP_WATCH);

  return isTimeBarActivity ? (
    <Slide direction={"up"} in={isTimeBarActivity}>
      <div className={getTimerBarClasses()}>
        <div style={{flexGrow: 1, textAlign: "center"}}>
          {
            isTimer ?
              (
                <PomodoroTimer startTimeInSeconds={getTimerTime(antecedenceTime + duration)}
                               onComplete={startRecoveryOrResume}
                               onPause={startPausedRecovery}
                               onBreak={startRecovery}
                               hidePause={isRecovery}
                               onResume={startRecoveryOrResume}
                               activityId={activityId}/>
              ) :
              <Stopwatch startTimeInSeconds={getTime(antecedenceTime)} activityId={activityId}/>
          }
        </div>
        <div onClick={stopActivity} className={classes.close}>
          <Close/>
        </div>
      </div>
    </Slide>) : null;
};

const mapStateToProps = state => {
  const {currentActivity, previousActivity, shouldTime} = selectActivityState(state);
  const {pomodoroSettings} = selectTacticalState(state);
  return {
    shouldTime,
    currentActivity,
    previousActivity,
    pomodoroSettings
  }
};

export default connect(mapStateToProps)(ActivityTimeBar);
