import * as React from 'react';
import {connect} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PauseCircleFilled from '@material-ui/icons/PauseCircleFilled';


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

const PausedPomodoro = ({}) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.contents}>
        <PauseCircleFilled
          id={'paused-pomodoro'}
          className={classes.icon}/>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(PausedPomodoro);