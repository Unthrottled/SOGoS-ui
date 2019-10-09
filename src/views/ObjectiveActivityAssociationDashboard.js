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
import {Card, Switch} from "@material-ui/core";
import type {Objective} from "../types/StrategyModels";
import {updatedObjective} from "../actions/StrategyActions";
import {TacticalActivityIcon} from "./TacticalActivityIcon";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import CardActionArea from "@material-ui/core/CardActionArea";

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
      fontSize: '1.25em',
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
    }
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
  const allTacticalActivities: TacticalActivity[] = objectToArray(activities);
  const associatedActivityDictionary = (rememberedObjective.associatedActivities || []).reduce((accum, activity) => {
    accum[activity] = true;
    return accum;
  }, {});
  const selectedActivities = allTacticalActivities.reduce((accum, activity) => {
    accum[activity.id] = !!associatedActivityDictionary[activity.id];
    return accum;
  }, {});


  const [activitySwitches, setActivitySwitches] = useState(selectedActivities);
  const toggleActivity = (activityId) => {
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
        .map(kv => kv.key)
    };
    dispatch(updatedObjective(objective));
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
            Activity Hub
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Something short and leading about the collection below—its contents, the creator, etc.
            Make it short and sweet, but not too short so folks don&apos;t simply skip over it
            entirely.
          </Typography>
          <TacticalActivityIcon/>
        </Container>
      </div>
      <div className={classes.root}>
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
        <Grid container justify={'center'}>
          <Grid item>
            <Grid container
                  style={{flexGrow: 1}}
                  justify={'center'}
                  spacing={4}
            >
              {
                allTacticalActivities.map(tacticalActivity => (
                  <Grid item
                        key={tacticalActivity.id}
                  >
                    <Card>
                        <div className={classes.content}>
                          <div className={classes.activityName}>{tacticalActivity.name}</div>
                          <div className={classes.activityAvatar}>
                            <TacticalActivityIcon tacticalActivity={tacticalActivity}
                                                  size={{
                                                    width: '75px',
                                                    height: '75px',
                                                  }}/>
                          </div>
                          <Switch checked={activitySwitches[tacticalActivity.id]}
                                  onChange={() => toggleActivity(tacticalActivity.id)}/>
                        </div>
                    </Card>
                  </Grid>
                ))
              }
            </Grid>
          </Grid>
        </Grid>
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
