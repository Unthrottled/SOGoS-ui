import React, {useState} from "react";
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import Typography from "@material-ui/core/Typography";
import {emphasize, makeStyles} from '@material-ui/core/styles';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Fab from "@material-ui/core/Fab";
import {withRouter} from "react-router-dom";
import {selectStrategyState, selectTacticalActivityState, selectUserState} from "../reducers";
import {objectToArray, objectToKeyValueArray} from "../miscellanous/Tools";
import type {TacticalActivity} from "../types/TacticalModels";
import {GoalIcon} from "./GoalIcon";
import {Switch} from "@material-ui/core";
import type {Objective} from "../types/StrategyModels";
import {createdObjective, updatedObjective} from "../actions/StrategyActions";
import {TacticalActivityIcon} from "./TacticalActivityIcon";

const useStyles = makeStyles(theme => (
  {
    inputContainer: {
      background: theme.palette.primary.main
    },
    root: {
      flexGrow: 1,
      height: 250,
    },
    input: {
      display: 'flex',
      padding: 0,
      height: 'auto',
    },
    valueContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flex: 1,
      alignItems: 'center',
      overflow: 'hidden',
    },
    chip: {
      margin: theme.spacing(0.5, 0.25),
    },
    chipFocused: {
      backgroundColor: emphasize(
        theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
        0.08,
      ),
    },
    noOptionsMessage: {
      padding: theme.spacing(1, 2),
    },
    singleValue: {
      fontSize: 16,
    },
    placeholder: {
      position: 'absolute',
      left: 2,
      bottom: 6,
      fontSize: 16,
    },
    paper: {
      position: 'absolute',
      zIndex: 1,
      marginTop: theme.spacing(1),
      left: 0,
      right: 0,
    },
    divider: {
      height: theme.spacing(2),
    },
    keyResults: {
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      margin: theme.spacing(2),
      borderRadius: theme.shape.borderRadius
    },
    avatar: {
      background: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
    },
    save: {
      position: 'relative',
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
    textField: {
      width: '100%',
    },
  }
));

const ObjectiveActivityAssociationDashboard = ({
                                                 dispatch,
                                                 objectives,
                                                 activities,
                                                 history,
                                                 fullName,
                                                 match: {params: {objectiveId}}
                                               }) => {
  const classes = useStyles();
  const rememberedObjective: Objective = objectives[objectiveId];
  const tacticalTacticalActivites: TacticalActivity[] = objectToArray(activities);
  const associatedActivityDictionary = (rememberedObjective.associatedActivities || []).reduce((accum, activity) => {
    accum[activity] = true;
    return accum;
  },{});
  const selectedActivites = tacticalTacticalActivites.reduce((accum, activity)=> {
    accum[activity.id] = !!associatedActivityDictionary[activity.id];
    return accum;
  },{});


  const [activitySwitches, setActivitySwitches] = useState(selectedActivites);
  const toggleActivity = (activityId)=>{
    activitySwitches[activityId] = !activitySwitches[activityId];
    setActivitySwitches({
      ...activitySwitches
    });
  };

  const saveObjective = () => {
    const objective: Objective = {
      ...rememberedObjective,
      associatedActivities: objectToKeyValueArray(activitySwitches)
        .filter(kv => kv.value)
        .map(kv=>kv.key)
    };
    dispatch(updatedObjective(objective));
    history.push('/strategy/objectives/')
  };

  const discardChanges = () => {
    history.push('/strategy/objectives/');
  };


  return (
    <LoggedInLayout>
      <h3>What's up {fullName}?</h3>
      <Typography>
        Dis is objective id {objectiveId}
      </Typography>
      <div className={classes.inputContainer}>

        <div className={classes.keyResults}>
          <List>
            {tacticalTacticalActivites.map((activity: TacticalActivity) => (
              <ListItem key={activity.id}>
                <ListItemAvatar>
                  <TacticalActivityIcon tacticalActivity={activity} size={{
                    width: '75px',
                    height: '75px',
                  }}/>
                </ListItemAvatar>
                <div> {activity.name} </div>
                <Switch checked={activitySwitches[activity.id]} onChange={() => toggleActivity(activity.id)}/>
              </ListItem>
            ))}
          </List>
        </div>
        <Fab color={'primary'}
             className={classes.save}
             onClick={saveObjective}
        >
          <SaveIcon/>
        </Fab>
        <Fab color={'primary'}
             className={classes.save}
             onClick={discardChanges}
        >
          <CancelIcon/>
        </Fab>
      </div>
    </LoggedInLayout>
  );
};

const mapStateToProps = state => {
  const {information: {fullName}} = selectUserState(state);
  const {objectives} = selectStrategyState(state);
  const {activities} = selectTacticalActivityState(state);
  return {
    fullName,
    objectives,
    activities
  }
};

export default connect(mapStateToProps)(withRouter(ObjectiveActivityAssociationDashboard));
