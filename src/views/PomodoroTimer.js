import React, {useRef, useState} from "react";
import Button from "@material-ui/core/Button";
import {TimeDisplay} from "./TimeDisplay";

export const PomodoroTimer = ({startTimeInSeconds}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [paused, setPaused] = useState(false);

  const storedRef = useRef();

  if (!(storedRef.current || paused)) {
    const emmitter = TimeEmitter(1000, () => storedRef.current = undefined);
    storedRef.current = emmitter((thing) => {
      console.log(timeElapsed + 1);
      setTimeElapsed(timeElapsed + 1)
    })
  }

  const pause = () => {
    storedRef.current();
    setPaused(true);
  };


  return (<div>
    am timer
    <TimeDisplay timeElapsed={timeElapsed}/>
    <Button variant={'contained'}
            color={'primary'}
            onClick={pause}>Dispose</Button>
  </div>)
};


const TimeEmitter = (timeout = 1000, onDispose = () => {}) => {
  let canceled = false;
  return (subscriber) => {
    const interval = setInterval(() => {
      if (!canceled) {
        subscriber('hola')
      }
    }, timeout);
    console.log('subscribed!');
    return () => {
      console.log('you killed me');
      onDispose();
      clearInterval(interval);
      canceled = true;
    }
  };
};