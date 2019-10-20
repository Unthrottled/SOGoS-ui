import React, {useState} from "react";
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from '@material-ui/core/styles';
import Fab from "@material-ui/core/Fab";
import {withRouter} from "react-router-dom";
import {selectStrategyState} from "../reducers";
import {objectToArray, objectToKeyValueArray} from "../miscellanous/Tools";
import {Card, Switch} from "@material-ui/core";
import type {Objective} from "../types/StrategyModels";
import {updatedObjective} from "../actions/StrategyActions";
import {TacticalActivityIcon} from "./TacticalActivityIcon";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import {GoalIcon} from "./GoalIcon";

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
      padding: `${theme.spacing(0.5)}px 0px`,
      textAlign: 'center'
    },
    inputContainer: {
      textAlign: 'center',
    },
    save: {
      margin: theme.spacing(2),
    },
    activityCard: {
      maxWidth: 250,
    },
  }
));

const ObjectiveActivityAssociationDashboard = ({
                                                 dispatch,
                                                 objectives,
                                                 history,
                                                 match: {params: {activityId}}
                                               }) => {
  const classes = useStyles();
  const allObjectives = objectToArray(objectives);
  const associatedObjectiveDictionary = allObjectives
    .filter(objective => (objective.associatedActivities || []).indexOf(activityId) > -1)
    .reduce((accum, objective) => {
      accum[objective.id] = true;
      return accum
    }, {});

  const selectedObjectives = allObjectives.reduce((accum, objective) => {
    accum[objective.id] = !!associatedObjectiveDictionary[objective.id];
    return accum;
  }, {});
  const [objectiveSwitches, setActivitySwitches] = useState(selectedObjectives);
  const toggleObjective = (objectiveId) => {
    objectiveSwitches[objectiveId] = !objectiveSwitches[objectiveId];
    setActivitySwitches({
      ...objectiveSwitches
    });
  };

  const saveActivity = () => {
    const updatedObjectives = objectToKeyValueArray(objectiveSwitches)
      .map(idToObjective => {
        const objective: Objective = objectives[idToObjective.key];
        const updatedObjective = {
          ...objective,
          associatedActivities: [
            ...((objective.associatedActivities || []).filter(a => !!a) || []),
          ]
        };
        if (idToObjective.value) {
          updatedObjective.associatedActivities.push(activityId)
        }

        return updatedObjective
      });
    updatedObjectives.forEach(objective => dispatch(updatedObjective(objective)));
    history.push('/tactical/activities/')
  };

  const discardChanges = () => {
    history.push('/tactical/activities/');
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
        <List justify={'center'}>
          <div>
            <div
              style={{flexGrow: 1}}

            >
              {
                allObjectives.map((objective: Objective) => (
                  <div key={objective.id} className={classes.activity}>
                    <Card>
                      <div className={classes.content}>
                        <div className={classes.activityAvatar}>
                          <GoalIcon objective={objective}
                                    size={{
                                      width: '45px',
                                      height: '45px',
                                    }}/>
                        </div>
                        <div className={classes.activityName}>{objective.valueStatement}</div>
                        <div>
                          <Switch checked={objectiveSwitches[objective.id]}
                                  onChange={() => toggleObjective(objective.id)}/>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))
              }
            </div>
          </div>
        </List>
        <div className={classes.inputContainer}>
          <Fab color={'primary'}
               className={classes.save}
               onClick={saveActivity}
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

const mapStateToProps = state => {
  const {objectives} = selectStrategyState(state);
  return {
    objectives
  }
};

export default connect(mapStateToProps)(withRouter(ObjectiveActivityAssociationDashboard));
