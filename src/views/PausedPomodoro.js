import * as React from 'react';
import {connect} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import {selectActivityState, selectTacticalState} from "../reducers";
import Stopwatch from "./Stopwatch";
import {getTime} from "./ActivityTimeBar";


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
                        }) => {
  const classes = useStyles();
  const {antecedenceTime, content: {uuid: activityId, timedType, duration, name}} = currentActivity;

  return (
    <div className={classes.container}>
      <div className={classes.contents}>
        <PlayCircleFilled
          id={'paused-pomodoro'}
          className={classes.icon}/>
        <Stopwatch startTimeInSeconds={getTime(antecedenceTime)}
                   activityId={activityId}/>
      </div>
    </div>
  );
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