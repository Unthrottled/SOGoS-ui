import React, {useEffect, useState} from "react";
import Pause from '@material-ui/icons/Pause';
import SwapVert from '@material-ui/icons/SwapVert';
import PlayArrow from '@material-ui/icons/PlayArrow';
import {TimeDisplay} from "./TimeDisplay";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ActivitySelection from "./ActivitySelection";
import StopWatch from '@material-ui/icons/Timer';
import {GENERIC_ACTIVITY_NAME} from "./ActivityHub";

const useStyles = makeStyles(theme => ({
  stopwatchContainer: {
    display: 'inline-flex',
    marginTop: theme.spacing(1.5),
  },
  actionButton: {
    marginLeft: theme.spacing(1.5),
    lineHeight: 1,
    marginTop: 'auto',
  },
  swappo: {
    marginRight: theme.spacing(1.5),
    lineHeight: 1,
    marginTop: 'auto',
  },
  bigIcon: {
    fontSize: "175px",
    padding: "25px",
    background: theme.palette.primary.main,
    borderRadius: '50%',
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

  const [selectionOpen, setSelectionOpen] = useState(false);

  const classes = useStyles();
  const closeSelection = () => setSelectionOpen(false);
  const openSelection = () => setSelectionOpen(true);
  return (
    <div className={classes.stopwatchContainer}>
      {
        !hidePause &&
        (<div className={classes.swappo}
              onClick={openSelection}>
          <SwapVert/>
        </div>)
      }
      <div style={{margin: 'auto'}}>
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
      <ActivitySelection open={selectionOpen}
                         onClose={closeSelection}
                         onActivitySelection={activity => {
                           closeSelection();
                           pivotActivity(activity.name, {activityID: activity.id});
                         }}
                         onGenericActivitySelection={() => pivotActivity(GENERIC_ACTIVITY_NAME, {})}
                         genericIcon={<StopWatch className={classes.bigIcon}/>}
      />
    </div>);
};
