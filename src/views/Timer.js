import React, {useEffect, useState} from "react";

function getDisplayTime(hours, minutes, seconds) {
  const displayHours = hours ? `${hours}:` : '';
  const displayMinutes = Math.floor(Math.log10(minutes || 1)) ? `${minutes}:` : `0${minutes}:`;
  const displaySeconds = Math.floor(Math.log10(seconds || 1)) ? `${seconds}` : `0${seconds}`;
  return `${displayHours}${displayMinutes}${displaySeconds}`;
}

const Timer = ({startTimeInSeconds, activityId, countDown, onComplete}) => {
  const [timeElapsed, setTimeElapsed] = useState(startTimeInSeconds || 0);
  const [rememberedActivity, setRememberedActivity] = useState(activityId || '');
  const activityTheSame = rememberedActivity === activityId;
  useEffect(() => {
    let timeout;
    if (timeElapsed < 1 && countDown && activityTheSame) {
      onComplete && onComplete();
    } else {
      timeout = setTimeout(() => {
        const timeToIncrement = activityTheSame ? timeElapsed : startTimeInSeconds;
        setTimeElapsed(timeToIncrement + (countDown ? -1 : 1));
        if (!activityTheSame) {
          setRememberedActivity(activityId);
        }
      }, 1000);
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
      {displayTime}
    </div>
  )
};

export default Timer;
