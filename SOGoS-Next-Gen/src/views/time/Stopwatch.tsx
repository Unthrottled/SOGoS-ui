import React, {FC, useEffect, useState} from 'react';
import {TimeDisplay} from "./TimeDisplay";
import Pause from '@material-ui/icons/Pause';
import makeStyles from "@material-ui/core/styles/makeStyles";
import IconButton from "@material-ui/core/IconButton";
import Timeout = NodeJS.Timeout;

const useStyles = makeStyles(theme => ({
  stopwatchContainer: {
    display: 'inline-flex',
  },
  actionButton: {
    marginLeft: theme.spacing(1.5),
    lineHeight: 1,
    marginTop: 'auto',
  },
}));

interface Props {
  startTimeInSeconds: number,
  activityId: string,
  onPause?: ()=>void,
  onResume?: ()=>void,
  fontSize?: string,
}
const Stopwatch: FC<Props> = ({
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
  const [timeElapsed, setTimeElapsed] = useState(startTimeInSeconds || 0);

  useEffect(() => {
    let timeout: Timeout;
    if (!isPaused) {
      timeout = setTimeout(() => {
        setTimeElapsed(timeElapsed + 1);
      }, 1000);
    } else {
      // @ts-ignore
      if (timeout) {
            clearTimeout(timeout)
          }
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
  const getPauseButton = () =>
    (<IconButton color={'inherit'}
                 onClick={pauseTimer}
                 title={'Pause Work'}
    >
      <Pause/>
    </IconButton>);

  const actualFontSize = fontSize || '1em';
  const classes = useStyles();
  return (
    <div className={classes.stopwatchContainer}>
      <div style={{fontSize: actualFontSize, margin: 'auto'}}>
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
