import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {connect} from "react-redux";
import Slide from "@material-ui/core/Slide";
import Timer from "./Timer";
import Close from '@material-ui/icons/Close';
import {startNonTimedActivity} from "../actions/ActivityActions";
import uuid from "uuid/v4";
import {ActivityType} from "../events/ActivityEvents";

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

const ActivityTimer = ({shouldTime, antecedenceTime, dispatch: dispetch, activityId}) => {
  const classes = useStyles();
  const stopActivity = () =>{
    dispetch(startNonTimedActivity({
      name: 'RECOVERY',
      type: ActivityType.ACTIVE,
      id: uuid(),
    }))
  };
  return shouldTime ? (
    <Slide direction={"up"} in={shouldTime}>
      <div className={classes.timer}>
        <div style={{flexGrow: 1, textAlign: "center"}}>
          <Timer startTimeInSeconds={getTime(antecedenceTime)} activityId={activityId}/>
        </div>
        <div onClick={stopActivity} className={classes.close}>
          <Close/>
        </div>
      </div>
    </Slide>) : null;
};

const mapStateToProps = state => {
  const {activity: {shouldTime, currentActivity: {antecedenceTime, content: {uuid}}}} = state;
  return {
    shouldTime,
    antecedenceTime,
    activityId: uuid
  }
};

export default connect(mapStateToProps)(ActivityTimer);
