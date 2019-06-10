import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {connect} from "react-redux";
import Slide from "@material-ui/core/Slide";
import Timer from "./Timer";
import Close from '@material-ui/icons/Close';
import {startNonTimedActivity, startTimedActivity} from "../actions/ActivityActions";
import uuid from "uuid/v4";
import {ActivityTimedType, ActivityType} from "../events/ActivityEvents";

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
  close: {
    display: 'inline-flex',
    position: 'relative',
    cursor: 'pointer',
    paddingRight: theme.spacing(1)
  },
}));

const getTime = antecedenceTime => Math.floor((new Date().getTime() - antecedenceTime || 0) / 1000);
const getTimerTime = (stopTime) => Math.floor((stopTime - new Date().getTime()) / 1000);

const ActivityTimer = ({shouldTime, currentActivity, previousActivity, dispatch: dispetch}) => {
  const classes = useStyles();
  const {antecedenceTime, content: {uuid: activityId, timedType, duration, name}} = currentActivity;

  const stopActivity = () => {
    dispetch(startNonTimedActivity({
      name: 'RECOVERY',
      type: ActivityType.ACTIVE,
      uuid: uuid(),
    }))
  };
  const startRecoveryOrResume = () => {
    if(name === 'RECOVERY'){
      dispetch(startTimedActivity({
        ...previousActivity.content,
        uuid: uuid(),
      }));
    } else {
      dispetch(startTimedActivity({
        name: 'RECOVERY',
        type: ActivityType.ACTIVE,
        timedType: ActivityTimedType.TIMER,
        duration: 6000,
        uuid: uuid(),
      }));
    }
  };

  const isTimer = timedType === ActivityTimedType.TIMER;
  return shouldTime ? (
    <Slide direction={"up"} in={shouldTime}>
      <div className={classes.timer}>
        <div style={{flexGrow: 1, textAlign: "center"}}>
          {
            isTimer ?
              <Timer startTimeInSeconds={getTimerTime(antecedenceTime + duration)}
                     onComplete={startRecoveryOrResume}
                     countDown
                     activityId={activityId}/> :
              <Timer startTimeInSeconds={getTime(antecedenceTime)} activityId={activityId}/>
          }
        </div>
        <div onClick={stopActivity} className={classes.close}>
          <Close/>
        </div>
      </div>
    </Slide>) : null;
};

const mapStateToProps = state => {
  const {activity: {shouldTime, currentActivity, previousActivity}} = state;
  return {
    shouldTime,
    currentActivity,
    previousActivity
  }
};

export default connect(mapStateToProps)(ActivityTimer);
