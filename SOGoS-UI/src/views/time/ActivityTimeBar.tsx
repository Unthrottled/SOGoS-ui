import React, {Dispatch} from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useDispatch, useSelector} from "react-redux";
import Slide from "@material-ui/core/Slide";
import Close from '@material-ui/icons/Close';
import uuid from "uuid/v4";
import {PomodoroTimer} from "./PomodoroTimer";
import Stopwatch from "./Stopwatch";
import {blue, green} from "@material-ui/core/colors";
import {GlobalState, selectActivityState, selectTacticalState} from "../../reducers";
import {TacticalActivityIcon} from "../icons/TacticalActivityIcon";
import {TomatoIcon} from "../icons/TomatoIcon";
import {mapTacticalActivitiesToID} from "../history/PieFlavored";
import {buildCommenceActivityContents} from "./ActivityHub";
import {startNonTimedActivity, startTimedActivity} from "../../actions/ActivityActions";
import omit from 'lodash/omit';
import {
  Activity,
  ActivityTimedType,
  ActivityType,
  getActivityID,
  isActivityRecovery,
  isPausedActivity,
  RECOVERY
} from "../../types/ActivityTypes";

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
    background: blue[500]
  },
  close: {
    display: 'inline-flex',
    position: 'relative',
    cursor: 'pointer',
    paddingRight: theme.spacing(1)
  },
  activityIcon: {
    lineHeight: 1,
    marginLeft: theme.spacing(1),
  },
}));


export const resumeActivity = (dispetch: Dispatch<any>,
                               previousActivity: Activity,
                               currentActivity: Activity) => {
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

const mapStateToProps = (state: GlobalState) => {
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


const ActivityTimeBar = () => {
  const classes = useStyles();
  const {
    shouldTime,
    currentActivity,
    activities,
    numberOfCompletedPomodoro,
    previousActivity,
    pomodoroSettings
  } = useSelector(mapStateToProps);

  const {content: {timedType, name}} = currentActivity;

  const dispetch: Dispatch<any> = useDispatch();
  const stopActivity = () => {
    dispetch(startNonTimedActivity({
      name: RECOVERY,
      type: ActivityType.ACTIVE,
      timedType: ActivityTimedType.NONE,
      uuid: uuid(),
    }))
  };

  const pivotActivity = (name: string, supplements: any) => {
    const activityContent = buildCommenceActivityContents(supplements, name);
    return dispetch(startTimedActivity({
      ...activityContent,
      paused: true,
    }));
  };

  const startPausedRecovery = () => {
    dispetch(startTimedActivity({
      name: RECOVERY,
      type: ActivityType.ACTIVE,
      timedType: ActivityTimedType.STOP_WATCH,
      paused: true,
      uuid: uuid(),
    }));
  };


  const resumePreviousActivity = () => {
    dispetch(startTimedActivity({
      ...omit(previousActivity.content, ['autoStart']),
      ...(previousActivity.content.duration ? {
        duration: pomodoroSettings.loadDuration
      } : {}),
      uuid: uuid(),
    }));
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

  const mappedTacticalActivities = mapTacticalActivitiesToID(activities);
  const tacticalActivity = mappedTacticalActivities[getActivityID(currentActivity)];

  const isTimeBarActivity = shouldTime && !isPausedActivity(currentActivity);
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
          !tacticalActivity && isTimer && !isRecovery && <TomatoIcon size={{
            width: '50px',
            height: '50px',
          }}/>
        }
        <div style={{flexGrow: 1, textAlign: "center"}}>
          {
            isTimer ?
              (
                <PomodoroTimer onPause={startPausedRecovery}
                               pivotActivity={pivotActivity}
                               hidePause={isRecovery}
                               onResume={resumePreviousActivity}/>
              ) :
              <Stopwatch onPause={startPausedRecovery}/>
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


export default ActivityTimeBar;
