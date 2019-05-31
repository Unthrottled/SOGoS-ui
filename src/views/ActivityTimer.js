import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Collapse from "@material-ui/core/Collapse";
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
  return (
    <Collapse in={shouldTime} timeout={2000}>
      <div className={classes.bar}>
        Hey!
      </div>
    </Collapse>) ;
};

const mapStateToProps = state =>{
  const {activity: {shouldTime}} = state;
  return{
    shouldTime
  }
};

export default connect(mapStateToProps)(ActivityTimer);
