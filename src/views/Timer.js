import React, {useEffect, useState} from "react";

function getDisplayTime(hours, minutes, seconds) {
  const displayHours = hours ? `${hours}:` : '';
  const displayMinutes = Math.floor(Math.log10(minutes || 1)) ? `${minutes}:` : `0${minutes}:`;
  const displaySeconds = Math.floor(Math.log10(seconds || 1)) ? `${seconds}` : `0${seconds}`;
  return `${displayHours}${displayMinutes}${displaySeconds}`;
}

const Timer = ({startTimeInSeconds, countDown, onComplete}) => {
  const [timeElapsed, setTimeElapsed] = useState(startTimeInSeconds || 0);
  useEffect(() => {
    let timeout;
    if(timeElapsed < 1 && countDown){
      onComplete && onComplete();
    } else {
       timeout = setTimeout(() => {
        setTimeElapsed(timeElapsed + (countDown ? -1 : 1))
      }, 1000);
    }
    return ()=>{
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
