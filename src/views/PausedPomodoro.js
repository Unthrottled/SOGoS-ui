import * as React from 'react';
import {connect} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import Stop from '@material-ui/icons/Stop';
import {selectActivityState} from "../reducers";
import Stopwatch from "./Stopwatch";
import {getTime, resumeActivity} from "./ActivityTimeBar";
import {ActivityTimedType, ActivityType, isActivityRecovery, RECOVERY} from "../types/ActivityModels";
import {startNonTimedActivity} from "../actions/ActivityActions";
import uuid from "uuid/v4";
import IconButton from "@material-ui/core/IconButton";
import {green} from "@material-ui/core/colors";


const useStyles = makeStyles(theme => ({
  container: {
    background: 'rgba(0,0,0,0.75)',
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
    color: green[800],
  },
  cancel: {
  },
  cancelIcon: {
    fontSize: '1.25em',
    color: 'red',
    background: 'rgba(240, 0,0,0.25)',
    borderRadius: '50%',
    padding: theme.spacing(0.5),
  },
}));

const PausedPomodoro = ({
                          shouldTime,
                          currentActivity,
                          previousActivity,
                          dispatch: dispetch
                        }) => {
  const classes = useStyles();
  const {antecedenceTime, content: {uuid: activityId, timedType}} = currentActivity;

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
        <div className={classes.stopWatch}>

        </div>
        <div className={classes.stopwatch}>
          <Stopwatch startTimeInSeconds={getTime(antecedenceTime)}
                     activityId={activityId}/>
        </div>
        <div className={classes.stopWatch}>
          <IconButton color={'inherit'} onClick={resumePreviousActivity}>
            <PlayCircleFilled
              id={'paused-pomodoro'}
              className={classes.icon}/>
          </IconButton>
          <IconButton
            className={classes.cancel}
            color={'inherit'} onClick={stopActivity}>
            <Stop className={classes.cancelIcon}/>
          </IconButton>
        </div>
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
