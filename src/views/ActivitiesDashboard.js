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
import {selectTacticalActivityState, selectUserState} from "../reducers";
import type {TacticalActivity} from "../types/TacticalModels";
import {TacticalActivityIcon} from "./TacticalActivityIcon";
import {Card} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import CardActionArea from "@material-ui/core/CardActionArea";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import {TacticalIcon} from "./TacticalIcon";
import {ActivityIcon} from "./ActivityIcon";

const useStyles = makeStyles(theme => ({
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
          <TacticalActivityIcon />
        </Container>
      </div>
      <Link to={`./${uuid()}`} style={{textDecoration: 'none'}}>
        <Button variant={'contained'}
                color={'primary'}
                className={classes.button}>
          <AddIcon/> Create Activity
        </Button>
      </Link>
      <div className={classes.root}>
        <Grid container justify={'center'}>
          <Grid item>
            <Grid container
                  style={{flexGrow: 1}}
                  justify={'center'}
                  spacing={4}
            >
              {
                allTacticalActivites.map(tacticalActivity => (
                  <Grid item
                        key={tacticalActivity.id}
                  >
                    <Card>
                      <CardActionArea onClick={() => history.push(`./${tacticalActivity.id}`)}>
                        <div className={classes.content}>
                          <div className={classes.activityName}>{tacticalActivity.name}</div>
                          <div className={classes.activityAvatar}>
                            <TacticalActivityIcon tacticalActivity={tacticalActivity}
                                                  size={{
                                                    width: '75px',
                                                    height: '75px',
                                                  }}/>
                          </div>
                        </div>
                      </CardActionArea>
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
  const {activities} = selectTacticalActivityState(state);
  return {
    fullName,
    activities,
  }
};

export default connect(mapStateToProps)(withRouter(ActivitiesDashboard));
