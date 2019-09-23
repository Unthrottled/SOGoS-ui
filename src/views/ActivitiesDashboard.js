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
import {objectToArray} from "../miscellanous/Tools";
import {createViewedTacticalActivitesEvent} from "../events/TacticalEvents";
import {selectTacticalActivityState, selectUserState} from "../reducers";
import type {TacticalActivity} from "../types/TacticalModels";
import {TacticalActivityIcon} from "./TacticalActivityIcon";

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

const ActivitiesDashboard = ({activities, fullName, dispatch}) => {
  const classes = useStyles();
  const [didMountState] = useState('');
  useEffect(() => {
    dispatch(createViewedTacticalActivitesEvent());
  }, [didMountState]);

  const allTacticalActivites: TacticalActivity[] = objectToArray(activities);

  return (
    <LoggedInLayout>
      <h3>What's up {fullName}?</h3>
      <Link to={`./${uuid()}`} style={{textDecoration: 'none'}}>
        <Button variant={'contained'}
                color={'primary'}
                className={classes.button}>
          <AddIcon/> Create Activity
        </Button>
      </Link>
      <div className={classes.root}>
        {
          allTacticalActivites.map(tacticalActivity => (
            <ExpansionPanel key={tacticalActivity.id} className={classes.objective}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon className={classes.objective}/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <TacticalActivityIcon tacticalActivity={tacticalActivity}
                                      size={{
                                        width: '75px',
                                        height: '75px',
                                      }}/>
                <Typography className={classes.heading}>{tacticalActivity.name}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div>
                  <Link to={`./${tacticalActivity.id}`} style={{textDecoration: 'none'}}>
                    <Button variant={'outlined'}
                            color={'secondary'}
                            className={classes.button}>
                      <AddIcon/> Edit Activity
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
  const {information: {fullName}} = selectUserState(state);
  const {activities} = selectTacticalActivityState(state);
  return {
    fullName,
    activities,
  }
};

export default connect(mapStateToProps)(ActivitiesDashboard);
