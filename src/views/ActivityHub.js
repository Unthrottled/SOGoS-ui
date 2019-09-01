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
import {selectConfigurationState, selectStrategyState, selectTacticalState} from "../reducers";
import {NOT_ASKED} from "../types/ConfigurationModels";
import {receivedNotificationPermission} from "../actions/ConfigurationActions";
import IconButton from "@material-ui/core/IconButton";
import {Cancel} from "@material-ui/icons";
import {Grow} from "@material-ui/core";
import {GoalIcon} from "./GoalIcon";
import {objectToArray} from "../miscellanous/Tools";
import type {Objective} from "../types/StrategyModels";


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
  bigIcon: {
    fontSize: "150px",
    padding: "50px",
    background: theme.palette.primary.main,
    borderRadius: '50%',
  }
}));

const ActivityHub = ({
                       dispatch: dispetch,
                       loadDuration,
                       notificationsAllowed,
                       objectives,
                     }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [strategyOpen, setStrategyOpen] = useState(false);

  const commenceActivity = (name, supplements) =>
    dispetch(startTimedActivity({
      ...supplements,
      name,
      type: ActivityType.ACTIVE,
      timedType: ActivityTimedType.STOP_WATCH,
      uuid: uuid(),
      workStartedWomboCombo: new Date().getTime(),
    }));

  const commenceTimedActivity = (name, supplements) => {
    if (notificationsAllowed === NOT_ASKED) {
      Notification.requestPermission()
        .then(res => dispetch(receivedNotificationPermission(res)));
    }
    return dispetch(startTimedActivity({
      ...supplements,
      name,
      type: ActivityType.ACTIVE,
      timedType: ActivityTimedType.TIMER,
      duration: loadDuration,
      uuid: uuid(),
    }));
  };

  const commenceTimedObjectiveActivity = (objective: Objective) =>{
    commenceTimedActivity("TIMED_OBJECTIVE_ACTIVITY", { objectiveID: objective.id})
  };

  const commenceGenericTimedActivity = () =>{
    commenceTimedActivity("GENERIC_TIMED_ACTIVITY", {})
  };

  const commenceObjectiveActivity = (objective: Objective) =>{
    commenceActivity("OBJECTIVE_ACTIVITY", { objectiveID: objective.id})
  };

  const commenceGenericActivity = () =>{
    commenceActivity("GENERIC_ACTIVITY", {})
  };

  const handleClick = () => setOpen(!open);

  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedGenericAction, setSelectedGenericAction] = useState(null);
  const invokeGenericAction = () =>{
    selectedGenericAction();
    closeStrategy();
  };

  const [selectedIcon, setSelectedIcon] = useState(null);
  const baseAction = (action, icon, genericAction) => {
    setStrategyOpen(!strategyOpen);
    setSelectedAction(() => action);
    setSelectedGenericAction(() => genericAction);
    setSelectedIcon(icon)
  };

  const closeStrategy = () => {
    setStrategyOpen(false);
  };

  const actions = [
    {
      icon: <Timer/>, name: 'Start Timed Task', perform: () => baseAction(commenceTimedObjectiveActivity,
        (<Timer className={classes.bigIcon}/>),
        commenceGenericTimedActivity)
    },
    {
      icon: <StopWatch/>, name: 'Start Task', perform: () => baseAction(commenceObjectiveActivity,
        (<StopWatch className={classes.bigIcon}/>),
        commenceGenericActivity)
    },
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
            {
              objectToArray(objectives).map(objective => (
                <IconButton color={'inherit'}
                            onClick={() => {
                              selectedAction(objective);
                              closeStrategy();
                            }}>
                  <GoalIcon objective={objective} size={{
                    height: '250px',
                    width: '250px',
                  }}/>
                </IconButton>
              ))
            }
            <IconButton
              onClick={invokeGenericAction}
              color={'inherit'}>
              {selectedIcon}
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
  const {objectives} = selectStrategyState(state);
  return {
    loadDuration,
    notificationsAllowed,
    objectives
  }
};

export default connect(mapStateToProps)(ActivityHub);
