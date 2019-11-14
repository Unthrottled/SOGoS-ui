import * as React from 'react';
import {connect} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import Stop from '@material-ui/icons/Stop';
import {selectActivityState, selectTacticalActivityState} from "../../reducers";
import Stopwatch from "./Stopwatch";
import {getTime, resumeActivity} from "./ActivityTimeBar";
import {
  ActivityTimedType,
  ActivityType,
  getActivityID,
  getActivityName,
  isPausedActivity,
  RECOVERY
} from "../types/ActivityModels";
import {startNonTimedActivity} from "../actions/ActivityActions";
import uuid from "uuid/v4";
import IconButton from "@material-ui/core/IconButton";
import {green} from "@material-ui/core/colors";
import {objectToArray} from "../../miscellanous/Tools";
import {dictionaryReducer} from "../../reducers/StrategyReducer";
import type {TacticalActivity} from "../types/TacticalModels";
import {TacticalActivityIcon} from "../icons/TacticalActivityIcon";
import {GENERIC_ACTIVITY_NAME} from "./ActivityHub";


const useStyles = makeStyles(theme => ({
  container: {
    background: 'rgba(0,0,0,0.9)',
    position: 'fixed',
    top: '0',
    width: '100%',
    zIndex: 10000,
    height: '100%',
  },
  contents: {
    top: '30%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  stopWatch: {
    margin: 'auto',
  },
  icon: {
    fontSize: '5em',
    color: green[500],
  },
  cancel: {},
  cancelIcon: {
    fontSize: '1.25em',
    color: 'red',
    background: 'rgba(240, 0,0,0.25)',
    borderRadius: '50%',
    padding: theme.spacing(0.5),
  },
  pivotContainer: {
    marginTop: theme.spacing(1),
  },
  pivotLabel: {
    display: 'flex',
    marginBottom: theme.spacing(1),
    justifyContent: 'center',
    fontSize: '1.5em',
  },
}));

const PausedPomodoro = ({
                          shouldTime,
                          currentActivity,
                          previousActivity,
                          activities,
                          dispatch: dispetch
                        }) => {
  const classes = useStyles();
  const {antecedenceTime, content: {uuid: activityId, timedType}} = currentActivity;

  const mappedTacticalActivities = objectToArray(activities).reduce(dictionaryReducer, {});
  const tacticalActivity: TacticalActivity = mappedTacticalActivities[getActivityID(currentActivity)];

  const stopActivity = () => {
    dispetch(startNonTimedActivity({
      name: RECOVERY,
      type: ActivityType.ACTIVE,
      uuid: uuid(),
    }))
  };

  const resumePreviousActivity = () => {
    resumeActivity(dispetch, previousActivity, currentActivity);
  };

  const isPausedPomodoro = shouldTime &&
    isPausedActivity(currentActivity) &&
    timedType === ActivityTimedType.STOP_WATCH;
  return isPausedPomodoro ? (
    <div className={classes.container}>
      <div className={classes.contents}>
        <div className={classes.stopWatch}>

        </div>
        <div className={classes.stopwatch}>
          <Stopwatch startTimeInSeconds={getTime(antecedenceTime)}
                     fontSize={'2em'}
                     activityId={activityId}/>
        </div>
        <div className={classes.stopWatch}>
          <IconButton color={'inherit'} onClick={resumePreviousActivity}>
            <PlayCircleFilled
              id={'paused-pomodoro'}
              className={classes.icon}/>
          </IconButton>
          <IconButton
            className={classes.cancel}
            color={'inherit'} onClick={stopActivity}>
            <Stop className={classes.cancelIcon}/>
          </IconButton>
        </div>
        {
          (tacticalActivity || getActivityName(currentActivity) === GENERIC_ACTIVITY_NAME) && (
            <div className={classes.pivotContainer}>
              <div className={classes.pivotLabel}>
                <div>Pivoted to: {getActivityName(currentActivity).replace(/_/, ' ')} </div>
              </div>
              {tacticalActivity && <TacticalActivityIcon tacticalActivity={tacticalActivity}/> }
            </div>
          )
        }
      </div>
    </div>
  ) : null;
};

const mapStateToProps = state => {
  const {currentActivity, previousActivity, shouldTime} = selectActivityState(state);
  const {activities} = selectTacticalActivityState(state);
  return {
    shouldTime,
    currentActivity,
    previousActivity,
    activities,
  };
};

export default connect(mapStateToProps)(PausedPomodoro);
