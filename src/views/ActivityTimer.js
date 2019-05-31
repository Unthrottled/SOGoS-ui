import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {connect} from "react-redux";

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
  return shouldTime ? (<div className={classes.bar}>
    Hey!
  </div>) : null;
};

const mapStateToProps = state =>{
  const {activity: {shouldTime}} = state;
  return{
    shouldTime
  }
}

export default connect(mapStateToProps)(ActivityTimer);
