import React, {useEffect, useState} from "react";
import Pause from '@material-ui/icons/Pause';
import SwapVert from '@material-ui/icons/SwapVert';
import PlayArrow from '@material-ui/icons/PlayArrow';
import {TimeDisplay} from "./TimeDisplay";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  stopwatchContainer: {
    display: 'inline-flex',
    marginTop: theme.spacing(1.5),
  },
  actionButton: {
    marginLeft: theme.spacing(1.5),
  },
  swappo: {
    marginRight: theme.spacing(1.5),
  },
}));

export const PomodoroTimer = ({
                                startTimeInSeconds,
                                activityId,
                                onComplete,
                                onPause,
                                pivotActivity,
                                onBreak,
                                onResume,
                                hidePause,
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

  const [rememberedActivity, setRememberedActivity] = useState(activityId || '');
  const activityTheSame = rememberedActivity === activityId;
  const [timeElapsed, setTimeElapsed] = useState(startTimeInSeconds || 0);
  useEffect(() => {
    let timeout;
    if (timeElapsed < 1 && activityTheSame) {
      onComplete && onComplete();
    } else if (!isPaused) {
      timeout = setTimeout(() => {
        setTimeElapsed(timeElapsed - 1);
      }, 1000);
    } else if (timeout) {
      clearTimeout(timeout)
    }

    return () => {
      clearTimeout(timeout)
    }
  });

  if (!activityTheSame) {
    setTimeElapsed(startTimeInSeconds);
    setRememberedActivity(activityId);
  }

  const classes = useStyles();
  return (
    <div className={classes.stopwatchContainer}>
      {
        !hidePause &&
        (<div className={classes.swappo}
              onClick={pivotActivity}>
          <SwapVert/>
        </div>)
      }
      <div>
        <TimeDisplay timeElapsed={timeElapsed}/>
      </div>
      <div className={classes.actionButton}>
        {
          !hidePause && (isPaused ?
            (<div onClick={resumeTimer}>
              <PlayArrow/>
            </div>) :
            (<div onClick={pauseTimer}>
              <Pause/>
            </div>))
        }
      </div>
    </div>);
};
