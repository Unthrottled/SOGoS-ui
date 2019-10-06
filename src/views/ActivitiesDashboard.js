import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import {makeStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add'
import uuid from 'uuid/v4';
import {Link, withRouter} from "react-router-dom";
import {objectToArray} from "../miscellanous/Tools";
import {createViewedTacticalActivitesEvent} from "../events/TacticalEvents";
import EditIcon from '@material-ui/icons/Edit'
import {selectTacticalActivityState, selectUserState} from "../reducers";
import type {TacticalActivity} from "../types/TacticalModels";
import {TacticalActivityIcon} from "./TacticalActivityIcon";
import {Card, CardHeader} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";

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

const ActivitiesDashboard = ({activities, fullName, dispatch, history}) => {
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
        <Grid container spacing={4}>
          {
            allTacticalActivites.map(tacticalActivity => (
              <Grid item xs={3}
                    key={tacticalActivity.id}
              >
                <Card>
                  <CardHeader avatar={
                    (<TacticalActivityIcon tacticalActivity={tacticalActivity}
                                           size={{
                                             width: '75px',
                                             height: '75px',
                                           }}/>)}
                              title={tacticalActivity.name}
                              action={
                                <IconButton onClick={()=>history.push(`./${tacticalActivity.id}`)}>
                                  <EditIcon/>
                                </IconButton>
                              }
                  />
                </Card>
              </Grid>
            ))
          }
        </Grid>
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

export default connect(mapStateToProps)(withRouter(ActivitiesDashboard));
