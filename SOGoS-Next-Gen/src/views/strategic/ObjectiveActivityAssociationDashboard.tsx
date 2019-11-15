import React, {FC, useState} from "react";
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import {connect, DispatchProp} from "react-redux";
import LoggedInLayout from "../components/LoggedInLayout";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from '@material-ui/core/styles';
import Fab from "@material-ui/core/Fab";
import {useHistory, useParams} from "react-router-dom";
import {GlobalState, selectStrategyState, selectTacticalActivityState} from "../../reducers";
import {objectToArray, objectToKeyValueArray} from "../../miscellanous/Tools";
import {Switch} from "@material-ui/core";
import {TacticalActivityIcon} from "../icons/TacticalActivityIcon";
import Container from "@material-ui/core/Container";
import ActivityList from "../tactical/ActivityList";
import {GoalIcon} from "../icons/GoalIcon";
import {Objective} from "../../types/StrategyTypes";
import {TacticalActivity} from "../../types/TacticalTypes";
import {StringDictionary} from "../../types/BaseTypes";
import reduceRight from 'lodash/reduceRight';
import {createUpdatedObjectiveEvent} from "../../events/StrategyEvents";

const useStyles = makeStyles(theme => (
  {
    root: {
      width: '100%',
      textAlign: 'left',
    },
    button: {
      margin: theme.spacing(1)
    },
    headerContent: {
      borderRadius: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(6, 0, 6),
      marginBottom: theme.spacing(1),
    },
    heading: {
      fontSize: theme.typography.pxToRem(20),
      margin: 'auto 0',
      paddingLeft: '1rem',
      fontWeight: theme.typography.fontWeightRegular,
    },
    objective: {
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    activityName: {
      padding: theme.spacing(1),
      flexGrow: 1,
    },
    activityAvatar: {
      padding: theme.spacing(1),
      textAlign: 'center',
    },
    objectiveSummary: {},
    content: {
      padding: theme.spacing(2),
      alignItems: 'center',
      textAlign: 'center',
      display: 'flex',
    },
    activity: {
      padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
      textAlign: 'center'
    },
    inputContainer: {
      textAlign: 'center',
      position: 'fixed',
      bottom: theme.spacing(2),
      left: 0,
      width: '100%',
    },
    save: {
      margin: theme.spacing(2),
    },
  }
));

export const createAssociationComponent = (rememberedObjective: Objective,
                                           rememberedActivity?: TacticalActivity) =>
  <div style={{
    display: 'flex',
    justifyContent: 'center',
  }}>
    <GoalIcon objective={rememberedObjective}/>
    <SwapHorizIcon style={{
      color: 'grey',
      margin: 'auto 0',
      fontSize: '2em'
    }}/>
    <TacticalActivityIcon tacticalActivity={rememberedActivity}/>
  </div>;

interface Props {
  objectives: StringDictionary<Objective>,
  activities: StringDictionary<TacticalActivity>,
}

const ObjectiveActivityAssociationDashboard: FC<DispatchProp & Props> = ({
                                                                           dispatch,
                                                                           objectives,
                                                                           activities,
                                                                         }) => {
  const classes = useStyles();
  const {objectiveId} = useParams<{ objectiveId: string }>();
  const rememberedObjective: Objective = objectives[objectiveId];
  const allTacticalActivities: TacticalActivity[] = objectToArray(activities);
  const associatedActivityDictionary = reduceRight((rememberedObjective.associatedActivities || []),
    (accum: StringDictionary<boolean>, activity) => {
      accum[activity] = true;
      return accum;
    }, {});

  const selectedActivities = reduceRight(allTacticalActivities,
    (accum: StringDictionary<boolean>, activity) => {
      accum[activity.id] = !!associatedActivityDictionary[activity.id];
      return accum;
    }, {});


  const [activitySwitches, setActivitySwitches] = useState(selectedActivities);
  const toggleActivity = (activityId: string) => {
    activitySwitches[activityId] = !activitySwitches[activityId];
    setActivitySwitches({
      ...activitySwitches
    });
  };

  const history = useHistory();
  const saveObjective = () => {
    const objective: Objective = {
      ...rememberedObjective,
      associatedActivities: objectToKeyValueArray(activitySwitches)
        .filter(kv => kv.value)
        .map(kv => kv.key)
    };
    dispatch(createUpdatedObjectiveEvent(objective));
    history.push('/strategy/objectives/')
  };

  const discardChanges = () => {
    history.push('/strategy/objectives/');
  };


  return (
    <LoggedInLayout>
      <div className={classes.headerContent}>
        <Container maxWidth={'sm'}>
          <Typography component={'h1'}
                      variant={'h2'}
                      align={'center'}
                      color={'textPrimary'}
                      gutterBottom>
            Associated Activities
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph gutterBottom>
            Find activities that help you reach your objective:
          </Typography>
          <Typography variant="h5" color={'textPrimary'} align="center" paragraph>
            {rememberedObjective.valueStatement}
          </Typography>
          {
            createAssociationComponent(rememberedObjective)
          }
        </Container>
      </div>
      <div className={classes.root}>
        <ActivityList
          actionComponent={(tacticalActivity: TacticalActivity) =>
            <Switch checked={activitySwitches[tacticalActivity.id]}
                    onChange={() => toggleActivity(tacticalActivity.id)}/>
          }
        />
        <div className={classes.inputContainer}>
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

      </div>
    </LoggedInLayout>
  );
};

const mapStateToProps = (state: GlobalState) => {
  const {objectives} = selectStrategyState(state);
  const {activities} = selectTacticalActivityState(state);
  return {
    objectives,
    activities
  }
};

// @ts-ignore
export default connect(mapStateToProps)(ObjectiveActivityAssociationDashboard);
