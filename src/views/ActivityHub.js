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
import {selectConfigurationState, selectTacticalState} from "../reducers";
import {NOT_ASKED} from "../types/ConfigurationModels";
import {receivedNotificationPermission} from "../actions/ConfigurationActions";

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

const ActivityHub = ({
                       dispatch: dispetch,
                       loadDuration,
                       notificationsAllowed,
                     }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const commenceActivity = () =>
    dispetch(startTimedActivity({
      name: "SOME_ACTIVITY",
      type: ActivityType.ACTIVE,
      timedType: ActivityTimedType.STOP_WATCH,
      uuid: uuid(),
    }));

  const commenceTimedActivity = () => {
    if(notificationsAllowed === NOT_ASKED) {
      Notification.requestPermission()
        .then(res => dispetch(receivedNotificationPermission(res)));
    }
    return dispetch(startTimedActivity({
      name: "SOME_TIMED_ACTIVITY",
      type: ActivityType.ACTIVE,
      timedType: ActivityTimedType.TIMER,
      duration: 20000,
      // duration: loadDuration,
      uuid: uuid(),
    }));
  };

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

const mapStateToProps = state => {
  const {pomodoroSettings: {loadDuration}} = selectTacticalState(state);
  const {miscellaneous: {notificationsAllowed}} = selectConfigurationState(state);
  return {
    loadDuration,
    notificationsAllowed
  }
};

export default connect(mapStateToProps)(ActivityHub);
