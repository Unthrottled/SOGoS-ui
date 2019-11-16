import React, {FC, useEffect, useState} from "react";
import Pause from '@material-ui/icons/Pause';
import SwapVert from '@material-ui/icons/SwapVert';
import {TimeDisplay} from "./TimeDisplay";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ActivitySelection from "./ActivitySelection";
import StopWatch from '@material-ui/icons/Timer';
import {GENERIC_ACTIVITY_NAME} from "./ActivityHub";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles(theme => ({
  stopwatchContainer: {
    display: 'inline-flex',
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

interface Props {
  startTimeInSeconds: number,
  activityId: string,
  onPause?: () => void,
  onComplete?: () => void,
  onResume?: () => void,
  onBreak?: () => void,
  fontSize?: string,
  pivotActivity?: (name: string, stuff: { activityID?: string }) => void,
  hidePause?: boolean
}


export const PomodoroTimer: FC<Props> = ({
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
    onPause && onPause();
    setIsPaused(true)
  };

  const [rememberedActivity, setRememberedActivity] = useState(activityId || '');
  const activityTheSame = rememberedActivity === activityId;
  const [timeElapsed, setTimeElapsed] = useState(startTimeInSeconds || 0);
  useEffect(() => {
    let timeout: any;
    if (timeElapsed < 1 && activityTheSame) {
      onComplete && onComplete();
    } else if (!isPaused) {
      timeout = setTimeout(() => {
        setTimeElapsed(timeElapsed - 1);
      }, 1000);
    }
    return () => {
      timeout && clearTimeout(timeout)
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
        (<IconButton
          color={'inherit'}
          title={'Pivot to Activity'}
          className={classes.swappo}
          onClick={openSelection}>
          <SwapVert/>
        </IconButton>)
      }
      <div style={{margin: 'auto'}}>
        <TimeDisplay timeElapsed={timeElapsed}/>
      </div>
      <div className={classes.actionButton}>
        {
          !hidePause &&
          (<IconButton
            title={'Pause Pomodoro'}
            color={'inherit'}
            onClick={pauseTimer}>
            <Pause/>
          </IconButton>)
        }
      </div>
      <ActivitySelection open={selectionOpen}
                         onClose={closeSelection}
                         onActivitySelection={activity => {
                           closeSelection();
                           pivotActivity && pivotActivity(activity.name, {activityID: activity.id});
                         }}
                         onGenericActivitySelection={() => pivotActivity && pivotActivity(GENERIC_ACTIVITY_NAME, {})}
                         genericIcon={<StopWatch className={classes.bigIcon}/>}
      />
    </div>);
};
