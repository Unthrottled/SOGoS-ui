import React, {useEffect, useState} from "react";
import Pause from '@material-ui/icons/Pause';
import PlayArrow from '@material-ui/icons/PlayArrow';
import {TimeDisplay} from "./TimeDisplay";

export const PomodoroTimer = ({
                                startTimeInSeconds,
                                activityId,
                                onComplete,
                                onPause,
                                onBreak,
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

  if(!activityTheSame){
    setTimeElapsed(startTimeInSeconds);
    setRememberedActivity(activityId);
  }

  return (
    <div>
      <div>
        <TimeDisplay timeElapsed={timeElapsed}/>
      </div>
      <div>
        {
          isPaused ?
            (<div onClick={resumeTimer}>
              <PlayArrow/>
            </div>) :
            (<div onClick={pauseTimer}>
              <Pause/>
            </div>)
        }
      </div>
    </div>);
};