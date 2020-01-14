import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import SpeedDial from '@material-ui/lab/SpeedDial';
import React, {useState} from 'react';
import StopWatch from '@material-ui/icons/Timer';
import uuid from 'uuid/v4';
import {useDispatch, useSelector} from 'react-redux';
import {
  GlobalState,
  selectConfigurationState,
  selectTacticalActivityState,
  selectTacticalState,
} from '../../reducers';
import {TomatoIcon} from '../icons/TomatoIcon';
import ActivitySelection from './ActivitySelection';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {ActivityTimedType, ActivityType} from '../../types/ActivityTypes';
import {startTimedActivity} from '../../actions/ActivityActions';
import {NOT_ASKED} from '../../types/ConfigurationTypes';
import {createNotificationPermissionReceivedEvent} from '../../events/ConfigurationEvents';
import {TacticalActivity} from '../../types/TacticalTypes';

// @ts-ignore real
const useStyles = makeStyles(theme => ({
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  speedDial: {
    top: theme.spacing(1),
    left: theme.spacing(1),
    margin: theme.spacing(1),
  },
  hubRoot: {
    position: 'sticky',
    top: theme.spacing(1),
    zIndex: 100,
  },
  container: {
    background: 'rgba(0,0,0,0.90)',
    position: 'fixed',
    top: '0',
    width: '100%',
    height: '100%',
    zIndex: '9001',
    overflow: 'auto',
  },
  toolTip: {
    zIndex: '9200',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  toolTipInner: {
    display: 'inline-block',
    fontSize: '1.5em',
  },
  contents: {
    top: '5%',
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
    fontSize: '2.5em',
    color: 'red',
    background: 'rgba(240, 0,0,0.25)',
    borderRadius: '50%',
  },
  bigIcon: {
    fontSize: '175px',
    padding: '25px',
    background: theme.palette.primary.main,
    borderRadius: '50%',
  },
  bigIconTomato: {
    padding: '30px',
    background: theme.palette.primary.main,
    borderRadius: '50%',
  },
  activityIcon: {},
  activityContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
}));

export const GENERIC_ACTIVITY_NAME = 'GENERIC_ACTIVITY';

const mapStateToProps = (state: GlobalState) => {
  const {
    pomodoro: {
      settings: {loadDuration},
    },
  } = selectTacticalState(state);
  const {
    miscellaneous: {notificationsAllowed},
  } = selectConfigurationState(state);
  const {activities} = selectTacticalActivityState(state);
  return {
    loadDuration,
    notificationsAllowed,
    activities,
  };
};

export const buildCommenceActivityContents = (
  supplements: any,
  name: string,
) => ({
  ...supplements,
  name,
  type: ActivityType.ACTIVE,
  timedType: ActivityTimedType.STOP_WATCH,
  uuid: uuid(),
  workStartedWomboCombo: new Date().getTime(),
});
type ActionType = (arg1: TacticalActivity) => void;
type Runnable = () => void;
const ActivityHub = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [strategyOpen, setStrategyOpen] = useState(false);

  const {loadDuration, notificationsAllowed} = useSelector(mapStateToProps);

  const dispetch = useDispatch();
  const commenceActivity = (name: string, supplements: any) =>
    dispetch(
      startTimedActivity(buildCommenceActivityContents(supplements, name)),
    );

  const commenceTimedActivity = (name: string, supplements: any) => {
    if (notificationsAllowed === NOT_ASKED) {
      // eslint-disable-next-line no-undef
      Notification.requestPermission().then(res =>
        dispetch(createNotificationPermissionReceivedEvent(res)),
      );
    }
    return dispetch(
      startTimedActivity({
        ...supplements,
        name,
        type: ActivityType.ACTIVE,
        timedType: ActivityTimedType.TIMER,
        duration: loadDuration,
        uuid: uuid(),
      }),
    );
  };

  const commenceTimedObjectiveActivity = (activity: TacticalActivity) => {
    commenceTimedActivity(activity.name, {activityID: activity.id});
  };

  const commenceGenericTimedActivity = () => {
    commenceTimedActivity('GENERIC_TIMED_ACTIVITY', {});
  };

  const commenceObjectiveActivity = (activity: TacticalActivity) => {
    commenceActivity(activity.name, {activityID: activity.id});
  };

  const commenceGenericActivity = () => {
    commenceActivity(GENERIC_ACTIVITY_NAME, {});
  };

  const handleClick = () => setOpen(!open);

  const [selectedAction, setSelectedAction] = useState<ActionType>(_ => {});
  const [selectedGenericAction, setSelectedGenericAction] = useState<Runnable>(
    () => {},
  );
  const invokeGenericAction = () => {
    selectedGenericAction();
    closeStrategy();
  };

  const [selectedIcon, setSelectedIcon] = useState<JSX.Element>(<></>);
  const baseAction = (action: any, icon: any, genericAction: any) => {
    setStrategyOpen(!strategyOpen);
    setSelectedAction(() => action);
    setSelectedGenericAction(() => genericAction);
    setSelectedIcon(icon);
  };

  const closeStrategy = () => {
    setStrategyOpen(false);
  };

  const actions = [
    {
      icon: (
        <div style={{marginTop: 5}}>
          <TomatoIcon size={{width: 24, height: 24}} />
        </div>
      ),
      name: 'Start Timed Task',
      perform: () =>
        baseAction(
          commenceTimedObjectiveActivity,
          <div className={classes.bigIconTomato}>
            <TomatoIcon size={{width: 100, height: 100}} />
          </div>,
          commenceGenericTimedActivity,
        ),
    },
    {
      icon: <StopWatch />,
      name: 'Start Task',
      perform: () =>
        baseAction(
          commenceObjectiveActivity,
          <StopWatch className={classes.bigIcon} />,
          commenceGenericActivity,
        ),
    },
  ];

  const [showToolTips, setShowTooltips] = useState(false);
  if (strategyOpen) {
    setTimeout(() => setShowTooltips(true), 250);
  } else if (showToolTips) {
    setShowTooltips(false);
  }

  return (
    <div className={classes.hubRoot}>
      <SpeedDial
        ariaLabel="SpeedDial example"
        className={classes.speedDial}
        hidden={false}
        transitionDuration={0}
        icon={<SpeedDialIcon />}
        onClick={handleClick}
        open={open}
        direction={'right'}>
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen={false}
            tooltipPlacement={'bottom'}
            onClick={() => {
              handleClick();
              action.perform();
            }}
            title={''}
          />
        ))}
      </SpeedDial>
      <ActivitySelection
        open={strategyOpen}
        onClose={closeStrategy}
        onActivitySelection={activity => {
          selectedAction(activity);
          closeStrategy();
        }}
        onGenericActivitySelection={invokeGenericAction}
        genericIcon={selectedIcon}
      />
    </div>
  );
};

export default ActivityHub;
