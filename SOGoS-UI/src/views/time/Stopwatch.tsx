import React, {FC} from 'react';
import {TimeDisplay} from "./TimeDisplay";
import Pause from '@material-ui/icons/Pause';
import makeStyles from "@material-ui/core/styles/makeStyles";
import IconButton from "@material-ui/core/IconButton";
import {useSelector} from "react-redux";
import {selectTimeState} from "../../reducers";

const useStyles = makeStyles(theme => ({
  stopwatchContainer: {
    display: 'inline-flex',
  },
  actionButton: {
    marginLeft: theme.spacing(1.5),
    lineHeight: 1,
    marginTop: 'auto',
  },
}));

interface Props {
  onPause?: () => void,
  onResume?: () => void,
  fontSize?: string,
}

const Stopwatch: FC<Props> = ({
                                onPause,
                                fontSize,
                              }) => {
  const pauseTimer = () => {
    onPause && onPause();
  };

  const timeElapsed = useSelector(selectTimeState).timeElapsed;

  const getPauseButton = () =>
    (<IconButton color={'inherit'}
                 onClick={pauseTimer}
                 title={'Pause Work'}
    >
      <Pause/>
    </IconButton>);

  const actualFontSize = fontSize || '1em';
  const classes = useStyles();
  return (
    <div className={classes.stopwatchContainer}>
      <div style={{fontSize: actualFontSize, margin: 'auto'}}>
        <TimeDisplay timeElapsed={timeElapsed}/>
      </div>
      <div className={classes.actionButton}>
        {
          onPause && getPauseButton()
        }
      </div>
    </div>
  )
};

export default Stopwatch;
