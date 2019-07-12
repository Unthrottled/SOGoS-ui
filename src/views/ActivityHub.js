import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import SpeedDial from "@material-ui/lab/SpeedDial";
import React, {useState} from "react";
import StopWatch from '@material-ui/icons/AvTimer';
import Timer from '@material-ui/icons/Timer';
import {makeStyles} from '@material-ui/core/styles';
import uuid from 'uuid/v4';
import {startTimedActivity} from "../actions/ActivityActions";
import {connect} from "react-redux";
import {ActivityTimedType, ActivityType} from "../types/ActivityModels";

const useStyles = makeStyles(theme => ({
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  speedDial: {
    position: 'relative',
    top: theme.spacing(1),
    left: theme.spacing(1),
    margin: theme.spacing(1),
  },
}));

const ActivityHub = ({dispatch: dispetch}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const commenceActivity = () =>
    dispetch(startTimedActivity({
      name: "SOME_ACTIVITY",
      type: ActivityType.ACTIVE,
      timedType: ActivityTimedType.STOP_WATCH,
      uuid: uuid(),
    }));

  const commenceTimedActivity = () =>
    dispetch(startTimedActivity({
      name: "SOME_TIMED_ACTIVITY",
      type: ActivityType.ACTIVE,
      timedType: ActivityTimedType.TIMER,
      duration: 360000,
      uuid: uuid(),
    }));

  const handleClick = () => setOpen(!open);

  const actions = [
    {icon: <Timer/>, name: 'Start Timed Task', perform: () => commenceTimedActivity()},
    {icon: <StopWatch/>, name: 'Start Task', perform: () => commenceActivity()},
  ];

  return (
    <SpeedDial
      ariaLabel="SpeedDial example"
      className={classes.speedDial}
      hidden={false}
      icon={<SpeedDialIcon/>}
      onClick={handleClick}
      open={open}
      direction={"right"}
    >
      {actions.map(action => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => {
            handleClick();
            action.perform();
          }}
          title={""}
          children={<div/>}/>
      ))}
    </SpeedDial>
  );
};

export default connect()(ActivityHub);
