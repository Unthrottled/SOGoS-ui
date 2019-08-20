import React from "react";
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles(theme => ({
  container: {
    background: theme.palette.primary.main,
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

const marks = [
  {
    value: 0,
    label: '0°C',
  },
  {
    value: 20,
    label: '20°C',
  },
  {
    value: 37,
    label: '37°C',
  },
  {
    value: 100,
    label: '100°C',
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
          step={10}
          marks={marks}
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
