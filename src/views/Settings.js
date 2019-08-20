import React from "react";
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Slider from "@material-ui/core/Slider";
import withStyles from "@material-ui/core/styles/withStyles";

const PrettoSlider = withStyles({
  root: {
    color: '#52af77',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus,&:hover,&$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

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

const LoggedIn = ({}) => {
  const classes = useStyles();
  return (
    <LoggedInLayout>
      <div className={classes.container}>
        <Slider
          id={'pomodoro-work-time'}
          label={'Working Duration (minutes)'}
          defaultValue={25}
          helperText={'How long to work before a break.'}
          aria-labelledby="discrete-slider-always"
          step={0.5}
          min={5}
          marks={workMarks}
          max={workMarks[workMarks.length - 1].value}
          valueLabelDisplay="on"
        />
        <Slider
          id={'pomodoro-recovery-time'}
          label={'Working Duration (minutes)'}
          defaultValue={5}
          helperText={'How long to recover before work.'}
          aria-labelledby="discrete-slider-always"
          step={0.5}
          min={0.5}
          marks={restMarks}
          max={restMarks[restMarks.length - 1].value}
          valueLabelDisplay="on"
        />
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

export default connect(mapStateToProps)(LoggedIn);
