import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add'
import uuid from 'uuid/v4';
import {Link} from "react-router-dom";
import {viewedObjectives} from "../actions/StrategyActions";
import {objectToArray} from "../miscellanous/Tools";
import type {Objective} from "../types/StrategyModels";
import {GoalIcon} from "./GoalIcon";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    textAlign: 'left',
  },
  button: {
    margin: theme.spacing(1)
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
  objectiveSummary: {},
}));

const MAX_OBJECTIVES = 5;

const ActivitiesDashboard = ({objectives, fullName, dispatch}) => {
  const classes = useStyles();
  const [didMountState] = useState('');
  useEffect(() => {
    dispatch(viewedObjectives());
  }, [didMountState]);

  const allObjectives: Objective[] = objectToArray(objectives);

  return (
    <LoggedInLayout>
      <h3>What's up {fullName}?</h3>
      {
        allObjectives.length >= MAX_OBJECTIVES ? null :
          (
            <Link to={`./${uuid()}`} style={{textDecoration: 'none'}}>
              <Button variant={'contained'}
                      color={'primary'}
                      className={classes.button}>
                <AddIcon/> Create Objective
              </Button>
            </Link>
          )
      }
      <div className={classes.root}>
        {
          allObjectives.map(objective => (
            <ExpansionPanel key={objective.id} className={classes.objective}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon className={classes.objective}/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <GoalIcon objective={objective} size={{
                  width: '75px',
                  height: '75px',
                }}/>
                <Typography className={classes.heading}>{objective.valueStatement}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <ul>
                  {
                    objective.keyResults.map(keyResult => (
                      <li key={keyResult.id}>
                        <Typography>
                          {keyResult.valueStatement}
                        </Typography>
                      </li>
                    ))
                  }
                </ul>
                <div>
                  <Link to={`./${objective.id}`} style={{textDecoration: 'none'}}>
                    <Button variant={'outlined'}
                            color={'secondary'}
                            className={classes.button}>
                      <AddIcon/> Edit Objective
                    </Button>
                  </Link>
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))
        }
      </div>
    </LoggedInLayout>
  );
};

const mapStateToProps = state => {
  const {user: {information: {fullName}}, strategy: {objectives}} = state;
  return {
    fullName,
    objectives,
  }
};

export default connect(mapStateToProps)(ActivitiesDashboard);
