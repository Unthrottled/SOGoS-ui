import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {connect} from "react-redux";
import Slide from "@material-ui/core/Slide";
import Close from '@material-ui/icons/Close';
import {startNonTimedActivity, startTimedActivity} from "../actions/ActivityActions";
import uuid from "uuid/v4";
import {ActivityTimedType, ActivityType} from "../types/ActivityModels";
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
const RECOVERY = 'RECOVERY';
const getTime = antecedenceTime => Math.floor((new Date().getTime() - antecedenceTime || 0) / 1000);
const getTimerTime = (stopTime) => Math.floor((stopTime - new Date().getTime()) / 1000);

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

  const startRecoveryOrResume = () => {
    if (name === RECOVERY) {
      dispetch(startTimedActivity({
        ...previousActivity.content,
        uuid: uuid(),
      }));
    } else {
      startRecovery()
    }
  };

  const isTimer = timedType === ActivityTimedType.TIMER;

  const getTimerBarClasses = () => {
    const isRecovery = RECOVERY === name;
    const timerBarClasses = [classes.timer];
    if (isRecovery) {
      timerBarClasses.push(classes.recovery)
    }
    return timerBarClasses.join(' ');
  };

  return shouldTime ? (
    <Slide direction={"up"} in={shouldTime}>
      <div className={getTimerBarClasses()}>
        <div style={{flexGrow: 1, textAlign: "center"}}>
          {
            isTimer ?
              (
                <PomodoroTimer startTimeInSeconds={getTimerTime(antecedenceTime + duration)}
                               onComplete={startRecoveryOrResume}
                               onPause={startRecoveryOrResume}
                               onBreak={startRecovery}
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
