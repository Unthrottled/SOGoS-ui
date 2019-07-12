import React, {useEffect, useState} from "react";
import Pause from '@material-ui/icons/Pause';
import PlayArrow from '@material-ui/icons/PlayArrow';

function getDisplayTime(hours, minutes, seconds) {
  const displayHours = hours ? `${hours}:` : '';
  const displayMinutes = Math.floor(Math.log10(minutes || 1)) ? `${minutes}:` : `0${minutes}:`;
  const displaySeconds = Math.floor(Math.log10(seconds || 1)) ? `${seconds}` : `0${seconds}`;
  return `${displayHours}${displayMinutes}${displaySeconds}`;
}

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
  const hours = Math.floor(timeElapsed / 3600);
  const remainingTimeForMinutes = timeElapsed - (hours * 3600);
  const minutes = Math.floor(remainingTimeForMinutes / 60);
  const seconds = remainingTimeForMinutes - (minutes * 60);
  const displayTime = getDisplayTime(hours, minutes, seconds);
  return (
    <div>
      <div>
        {displayTime}
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
