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
import IconButton from "@material-ui/core/IconButton";
import {Cancel} from "@material-ui/icons";
import {Grow} from "@material-ui/core";
import Goal from '../images/Goal.svg';
import ReactSVG from 'react-svg';

const GoalSVG = () => (<ReactSVG src={Goal} beforeInjection={(svg) => {
  svg.setAttribute('width', '200px');
  svg.setAttribute('height', '200px');
  window.svgboi = svg
}}/>);

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
  container: {
    background: 'rgba(0,0,0,0.2)',
    position: 'absolute',
    top: '0',
    width: '100%',
    height: '100%',
    zIndex: '9001',
  },
  contents: {
    top: '20%',
    height: '100%',
    position: 'relative',
  },
  icon: {
    fontSize: '4em',
  },
  cancel: {
    marginTop: theme.spacing(5),
  },
  cancelIcon: {
    fontSize: '1.25em',
  },
}));

const ActivityHub = ({
                       dispatch: dispetch,
                       loadDuration,
                       notificationsAllowed,
                     }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [strategyOpen, setStrategyOpen] = useState(false);

  const commenceActivity = () =>
    dispetch(startTimedActivity({
      name: "SOME_ACTIVITY",
      type: ActivityType.ACTIVE,
      timedType: ActivityTimedType.STOP_WATCH,
      uuid: uuid(),
      workStartedWomboCombo: new Date().getTime(),
    }));

  const commenceTimedActivity = () => {
    if (notificationsAllowed === NOT_ASKED) {
      Notification.requestPermission()
        .then(res => dispetch(receivedNotificationPermission(res)));
    }
    return dispetch(startTimedActivity({
      name: "SOME_TIMED_ACTIVITY",
      type: ActivityType.ACTIVE,
      timedType: ActivityTimedType.TIMER,
      duration: loadDuration,
      uuid: uuid(),
    }));
  };

  const handleClick = () => setOpen(!open);

  const baseAction = (callBack) => {
    setStrategyOpen(!strategyOpen);
  };

  const closeStrategy = () => {
    setStrategyOpen(false);
  };

  const actions = [
    {icon: <Timer/>, name: 'Start Timed Task', perform: () => baseAction(commenceTimedActivity)},
    {icon: <StopWatch/>, name: 'Start Task', perform: () => baseAction(commenceActivity)},
  ];

  return (
    <div>
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
            tooltipOpen
            tooltipPlacement={'bottom'}
            onClick={() => {
              handleClick();
              action.perform();
            }}
            title={""}
            children={<div/>}/>
        ))}
      </SpeedDial>
      <Grow in={strategyOpen}>
        <div className={classes.container}>
          <div className={classes.contents}>
            <IconButton color={'inherit'}>
              <GoalSVG/>
            </IconButton><IconButton color={'inherit'}>
            <GoalSVG/>
          </IconButton><IconButton color={'inherit'}>
            <GoalSVG/>
          </IconButton><IconButton color={'inherit'}>
            <GoalSVG/>
          </IconButton><IconButton color={'inherit'}>
            <GoalSVG/>
          </IconButton><IconButton color={'inherit'}>
            <GoalSVG/>
          </IconButton>
            <br/>
            <IconButton
              className={classes.cancel}
              onClick={closeStrategy}
              color={'inherit'}>
              <Cancel className={classes.cancelIcon}/>
            </IconButton>
          </div>
        </div>
      </Grow>
    </div>

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
