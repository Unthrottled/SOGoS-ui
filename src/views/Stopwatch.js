import React, {useEffect, useState} from 'react';
import {TimeDisplay} from "./TimeDisplay";
import Pause from '@material-ui/icons/Pause';
import PlayArrow from '@material-ui/icons/PlayArrow';

const Stopwatch = ({
                     startTimeInSeconds,
                     activityId,
                     onPause,
                     onResume
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
    (<div onClick={pauseTimer}>
      <Pause/>
    </div>);


  return (
    <div>
      <div>
        <TimeDisplay timeElapsed={timeElapsed}/>
      </div>
      <div>
        {
          onPause && getPauseButton()
        }
      </div>
    </div>
  )
};

export default Stopwatch;