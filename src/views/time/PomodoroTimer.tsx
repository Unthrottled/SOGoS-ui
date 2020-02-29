import React, {FC, useState} from 'react';
import Pause from '@material-ui/icons/Pause';
import SwapVert from '@material-ui/icons/SwapVert';
import {TimeDisplay} from './TimeDisplay';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ActivitySelection from './ActivitySelection';
import StopWatch from '@material-ui/icons/Timer';
import {GENERIC_ACTIVITY_NAME} from './ActivityHub';
import IconButton from '@material-ui/core/IconButton';
import {useSelector} from 'react-redux';
import {selectTimeState} from '../../reducers';
import {SwapHoriz} from "@material-ui/icons";

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
    fontSize: '175px',
    padding: '25px',
    background: theme.palette.primary.main,
    borderRadius: '50%',
  },
}));

type ChangeActivityCallback = (
  name: string,
  stuff: {activityID?: string},
) => void;

interface Props {
  onPause?: () => void;
  onResume?: () => void;
  fontSize?: string;
  pivotActivity?: ChangeActivityCallback;
  swapActivity?: ChangeActivityCallback;
  hidePause?: boolean;
  readOnly?: boolean;
}

export const PomodoroTimer: FC<Props> = ({
  onPause,
  pivotActivity,
  swapActivity,
  hidePause,
  readOnly,
}) => {
  const pauseTimer = () => {
    onPause && onPause();
  };

  const [selectionOpen, setSelectionOpen] = useState(false);

  const [changeActivityFunction, setChangeActivityFunction] = useState<{
    changeActivity: ChangeActivityCallback | undefined;
  }>({
    changeActivity: pivotActivity || swapActivity,
  });

  const classes = useStyles();
  const closeSelection = () => setSelectionOpen(false);
  const openPivotSelection = () => {
    setChangeActivityFunction({changeActivity: pivotActivity});
    setSelectionOpen(true);
  };
  const openSwappoSelection = () => {
    setChangeActivityFunction({changeActivity: swapActivity});
    setSelectionOpen(true);
  };

  const timeElapsed = useSelector(selectTimeState).timeElapsed;

  return (
    <div className={classes.stopwatchContainer}>
      {!hidePause && !readOnly && (
        <IconButton
          color={'inherit'}
          title={'Pivot to Activity'}
          className={classes.swappo}
          onClick={openPivotSelection}>
          <SwapVert />
        </IconButton>
      )}
      <div style={{
        ...(
          readOnly ? {marginTop: '10%', marginBottom: '10%'} :
            {margin: 'auto'}
        )
      }}>
        <TimeDisplay timeElapsed={timeElapsed} />
      </div>
      <div className={classes.actionButton}>
        {!hidePause && !readOnly && (
          <IconButton
            title={'Pause Pomodoro'}
            color={'inherit'}
            onClick={pauseTimer}>
            <Pause />
          </IconButton>
        )}
      </div>
      <div className={classes.actionButton}>
        {!hidePause && !readOnly && (
          <IconButton
            title={'Swap Activity'}
            color={'inherit'}
            onClick={openSwappoSelection}>
            <SwapHoriz />
          </IconButton>
        )}
      </div>

      <ActivitySelection
        open={selectionOpen}
        onClose={closeSelection}
        onActivitySelection={activity => {
          closeSelection();
          changeActivityFunction.changeActivity &&
            changeActivityFunction.changeActivity(activity.name, {
              activityID: activity.id,
            });
        }}
        onGenericActivitySelection={() =>
          changeActivityFunction.changeActivity &&
          changeActivityFunction.changeActivity(GENERIC_ACTIVITY_NAME, {})
        }
        genericIcon={<StopWatch className={classes.bigIcon} />}
      />
    </div>
  );
};
