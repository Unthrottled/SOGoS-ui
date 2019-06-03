import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {connect} from "react-redux";
import Slide from "@material-ui/core/Slide";
import Timer from "./Timer";

const useStyles = makeStyles(theme =>({
  timer: {
    position: 'fixed',
    bottom: 0,
    textAlign: 'center',
    width: '100%',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    background: theme.palette.secondary.main
  }
}));

const getTime = antecedenceTime => Math.floor((new Date().getTime() - antecedenceTime)/1000);

const ActivityTimer = ({shouldTime, antecedenceTime}) => {
  const classes = useStyles();
  return shouldTime ? (
    <Slide direction={"up"} in={shouldTime} >
      <div className={classes.timer}>
        <Timer startTimeInSeconds={getTime(antecedenceTime)} />
      </div>
    </Slide>) : null;
};

const mapStateToProps = state =>{
  const {activity: {shouldTime, currentActivity : {antecedenceTime}}} = state;
  return{
    shouldTime,
    antecedenceTime,
  }
};

export default connect(mapStateToProps)(ActivityTimer);
