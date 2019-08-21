import React, {useState} from "react";
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Slider from "@material-ui/core/Slider";
import SaveIcon from "@material-ui/icons/Save";
import Fab from "@material-ui/core/Fab";
import {Typography} from "@material-ui/core";
import {withRouter} from "react-router-dom";
import {createUpdatedPomodoroSettingsEvent} from "../events/TacticalEvents";

const useStyles = makeStyles(theme => ({
  container: {
    background: theme.palette.primary.dark,
    maxWidth: theme.spacing(50),
    margin: 'auto',
    padding: theme.spacing(3),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  menu: {
    width: 200,
  },
}));

const restMarks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 3,
    label: '3',
  },
  {
    value: 5,
    label: '5',
  },
  {
    value: 10,
    label: '10',
  },
  {
    value: 20,
    label: '20',
  },
  {
    value: 30,
    label: '30',
  },
];

const recoveryMarks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 5,
    label: '5',
  },
  {
    value: 10,
    label: '10',
  },
  {
    value: 20,
    label: '20',
  },
  {
    value: 30,
    label: '30',
  },
  {
    value: 60,
    label: '60',
  },
];

const workMarks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 15,
    label: '15',
  },
  {
    value: 30,
    label: '30',
  },
  {
    value: 60,
    label: '60',
  },
  {
    value: 90,
    label: '90',
  },
];

const SettingsBoard = ({
                         history,
                         dispatch,
                         pomodoroSettings,
                       }) => {
  const classes = useStyles();
  const [recoveryTime, setRecoveryTime] = useState(5);

  const saveRecoveryTime = (_, time) => {
    setRecoveryTime(time)
  };
  const [longRecoveryTime, setLongRecoveryTime] = useState(30);

  const saveLongRecoveryTime = (_, time) => {
    setLongRecoveryTime(time)
  };
  const [workTime, setWorkTime] = useState(25);

  const saveWorkTime = (_, time) => {
    setWorkTime(time)
  };
  const cycleTimeMinutes = (workTime + recoveryTime) * 4 - recoveryTime;

  const saveSettings = () => {
    dispatch(createUpdatedPomodoroSettingsEvent({
      loadDuration: workTime,
      shortRecoveryDuration: recoveryTime,
      longRecoveryDuration: longRecoveryTime,
    }))
    // history.push('/')
  };

  return (
    <LoggedInLayout>
      <div className={classes.container}>
        <Slider
          id={'pomodoro-work-time'}
          label={'Working Duration (minutes)'}
          defaultValue={workTime}
          aria-labelledby="discrete-slider-always"
          step={0.5}
          onChangeCommitted={saveWorkTime}
          min={5}
          marks={workMarks}
          max={workMarks[workMarks.length - 1].value}
          valueLabelDisplay="auto"
        />
        <Slider
          id={'pomodoro-recovery-time'}
          label={'Working Duration (minutes)'}
          defaultValue={recoveryTime}
          aria-labelledby="discrete-slider-always"
          step={0.5}
          onChangeCommitted={saveRecoveryTime}
          min={0.5}
          marks={restMarks}
          max={restMarks[restMarks.length - 1].value}
          valueLabelDisplay="auto"
        />
        <Slider
          id={'pomodoro-long-recovery-time'}
          label={'Working Duration (minutes)'}
          defaultValue={longRecoveryTime}
          aria-labelledby="discrete-slider-always"
          step={0.5}
          onChangeCommitted={saveLongRecoveryTime}
          min={5}
          marks={recoveryMarks}
          max={recoveryMarks[recoveryMarks.length - 1].value}
          valueLabelDisplay="auto"
        />
        <div>
          <Typography>
            Full Cycle Time (4 iterations):
            {cycleTimeMinutes} minutes or {(cycleTimeMinutes / 60).toFixed(2)} hours
          </Typography>
        </div>
        <Fab color={'primary'}
             className={classes.save}
             onClick={saveSettings}
        >
          <SaveIcon/>
        </Fab>
      </div>
    </LoggedInLayout>
  );
};

const mapStateToProps = state => {
  const {user: {information: {fullName}}} = state;
  return {
    fullName,
  }
};

export default connect(mapStateToProps)(withRouter(SettingsBoard));