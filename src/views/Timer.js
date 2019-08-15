import React, {useEffect, useState} from "react";
import Pause from '@material-ui/icons/Pause';
import PlayArrow from '@material-ui/icons/PlayArrow';
import {TimeDisplay} from "./TimeDisplay";

const Timer = ({startTimeInSeconds, activityId, countDown, onComplete, onPause, onResume}) => {
  const [timeElapsed, setTimeElapsed] = useState(startTimeInSeconds || 0);
  const [rememberedActivity, setRememberedActivity] = useState(activityId || '');
  const activityTheSame = rememberedActivity === activityId;
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimer = () => {
    onPause();
    setIsPaused(true)
  };
  const resumeTimer = ()=>{
    onResume();
    setIsPaused(false)
  };

  useEffect(() => {
    let timeout;
    if (timeElapsed < 1 && countDown && activityTheSame) {
      onComplete && onComplete();
    } else if(!isPaused) {
      timeout = setTimeout(() => {
        const timeToIncrement = activityTheSame ? timeElapsed : startTimeInSeconds;
        setTimeElapsed(timeToIncrement + (countDown ? -1 : 1));
        if (!activityTheSame) {
          setRememberedActivity(activityId);
        }
      }, 1000);
    } else if(timeout){
      clearTimeout(timeout)
    }
    return () => {
      clearTimeout(timeout)
    }
  });

  return (
    <div>
      <div>
        <TimeDisplay timeElapsed={timeElapsed}/>
      </div>
      {
        countDown ? (
          <div>
            {
              isPaused ?
                (<div onClick={resumeTimer}>
                <PlayArrow/>
                </div>):
                (<div onClick={pauseTimer}>
                  <Pause/>
                </div>)
            }
          </div>
        ) : null
      }
    </div>
  )
};

export default Timer;
