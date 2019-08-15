import React from "react";
import Button from "@material-ui/core/Button";

export const PomodoroTimer = ({startTimeInSeconds}) => {

  const emmitter = TimeEmitter();
  const disposeable = emmitter((thing)=>console.log(thing));
  return (<div>
    am timer
    <Button variant={'contained'}
            color={'primary'}
            onClick={()=> disposeable()}>Dispose</Button>
  </div>)
}


const TimeEmitter = () => {
  let canceled = false;
  return (subscriber) => {
    const timeout = setTimeout(()=>{
      if(!canceled){
        subscriber('hola')
      }
    }, 1);
    console.log('bustin')
    return () => {
      console.log(timeout)
      console.log('butts');
      canceled = true;
    }
  }
}