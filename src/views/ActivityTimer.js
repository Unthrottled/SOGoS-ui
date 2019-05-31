import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";

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

const ActivityTimer = () => {
  const classes = useStyles();
  return (<div className={classes.bar}>
    Hey!
  </div>)
};

export default ActivityTimer
