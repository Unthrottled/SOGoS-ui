import React, {useEffect, useState} from 'react';
import {TimeDisplay} from "./TimeDisplay";
import Pause from '@material-ui/icons/Pause';
import PlayArrow from '@material-ui/icons/PlayArrow';
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  stopwatchContainer: {
    display: 'inline-flex',
    marginTop: theme.spacing(1.5),
  },
  actionButton: {
    marginLeft: theme.spacing(1.5),
  },
}));

const Stopwatch = ({
                     startTimeInSeconds,
                     activityId,
                     onPause,
                     onResume,
                     fontSize,
                   }) => {
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimer = () => {
    onPause();
    setIsPaused(true)
  };
  const resumeTimer = () => {
    onResume();
    setIsPaused(false)
  };
  const [timeElapsed, setTimeElapsed] = useState(startTimeInSeconds || 0);

  useEffect(() => {
    let timeout;
    if (!isPaused) {
      timeout = setTimeout(() => {
        setTimeElapsed(timeElapsed + 1);
      }, 1000);
    } else if (timeout) {
      clearTimeout(timeout)
    }
    return () => {
      clearTimeout(timeout)
    }
  });
  const [rememberedActivity, setRememberedActivity] = useState(activityId || '');

  const activityTheSame = rememberedActivity === activityId;
  if (!activityTheSame) {
    setTimeElapsed(startTimeInSeconds);
    setRememberedActivity(activityId);
  }
  const getPauseButton = () => isPaused ?
    (<div onClick={resumeTimer}>
      <PlayArrow/>
    </div>) :
    (<div color={'inherit'} onClick={pauseTimer}>
      <Pause/>
    </div>);

  const actualFontSize = fontSize || '1em';
  const classes = useStyles();
  return (
    <div className={classes.stopwatchContainer}>
      <div style={{fontSize: actualFontSize}}>
        <TimeDisplay timeElapsed={timeElapsed}/>
      </div>
      <div className={classes.actionButton}>
        {
          onPause && getPauseButton()
        }
      </div>
    </div>
  )
};

export default Stopwatch;
