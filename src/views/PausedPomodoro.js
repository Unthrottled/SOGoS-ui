import * as React from 'react';
import {connect} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import {selectActivityState} from "../reducers";
import Stopwatch from "./Stopwatch";
import {getTime, resumeActivity} from "./ActivityTimeBar";
import {ActivityTimedType, ActivityType, isActivityRecovery, RECOVERY} from "../types/ActivityModels";
import {startNonTimedActivity} from "../actions/ActivityActions";
import uuid from "uuid/v4";
import IconButton from "@material-ui/core/IconButton";


const useStyles = makeStyles(theme => ({
  container: {
    background: 'rgba(0,0,0,0.2)',
    position: 'absolute',
    top: '0',
    width: '100%',
    height: '100%',
  },
  contents: {
    top: '50%',
    position: 'relative',
  },
  icon: {
    fontSize: '3em',
  }
}));

const PausedPomodoro = ({
                          shouldTime,
                          currentActivity,
                          previousActivity,
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

  const resumePreviousActivity = () => {
    resumeActivity(dispetch, previousActivity, currentActivity);
  };

  const isPausedPomodoro = shouldTime &&
    isActivityRecovery(currentActivity) &&
    timedType === ActivityTimedType.STOP_WATCH;
  return isPausedPomodoro ? (
    <div className={classes.container}>
      <div className={classes.contents}>
        <IconButton color={'inherit'} onClick={resumePreviousActivity}>
          <PlayCircleFilled
            id={'paused-pomodoro'}
            className={classes.icon}/>
        </IconButton>
        <Stopwatch startTimeInSeconds={getTime(antecedenceTime)}
                   activityId={activityId}/>
      </div>
    </div>
  ) : null;
};

const mapStateToProps = state => {
  const {currentActivity, previousActivity, shouldTime} = selectActivityState(state);
  return {
    shouldTime,
    currentActivity,
    previousActivity,
  };
};

export default connect(mapStateToProps)(PausedPomodoro);