import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {connect} from "react-redux";
import Slide from "@material-ui/core/Slide";

const useStyles = makeStyles(theme =>({
  bar: {
    position: 'absolute',
    bottom: 0,
    textAlign: 'center',
    width: '100%',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    background: theme.palette.secondary.main
  }
}));

const ActivityTimer = ({shouldTime}) => {
  const classes = useStyles();
  return (
    <Slide direction={"up"} in={shouldTime}  mountOnEnter unmountOnExit>
      <div className={classes.bar}>
        Hey!
      </div>
    </Slide>) ;
};

const mapStateToProps = state =>{
  const {activity: {shouldTime}} = state;
  return{
    shouldTime
  }
};

export default connect(mapStateToProps)(ActivityTimer);
