import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import {makeStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import SaveIcon from '@material-ui/icons/Save'
import {withRouter} from "react-router-dom";
import {objectToArray} from "../miscellanous/Tools";
import {createFetchedTacticalActivitesEvent, createViewedTacticalActivitesEvent} from "../events/TacticalEvents";
import {selectTacticalActivityState, selectUserState} from "../reducers";
import type {TacticalActivity} from "../types/TacticalModels";
import {TacticalActivityIcon} from "./TacticalActivityIcon";
import {Card} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

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
    display: 'flex',
  },
  activity: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
  },
}));

export const TacticalActivityList = ({tacticalActivities, classes}) => {
  return tacticalActivities.map((tacticalActivity, index) => (
    <Draggable key={tacticalActivity.id}
               draggableId={tacticalActivity.id}
               index={index}>
      {
        provided => (
          <div ref={provided.innerRef}
               {...provided.draggableProps}
               {...provided.dragHandleProps}
               className={classes.activity}
          >
            <Card>
              <div className={classes.content}>
                <div className={classes.activityAvatar}>
                  <TacticalActivityIcon tacticalActivity={tacticalActivity}
                                        size={{
                                          width: '45px',
                                          height: '45px',
                                        }}/>
                </div>
                <div className={classes.activityName}>{tacticalActivity.name}</div>
              </div>
            </Card>
          </div>
        )
      }
    </Draggable>
  ));
};


const ActivitiesDashboard = ({activities, dispatch, history}) => {
  const classes = useStyles();
  const [didMountState] = useState('');
  useEffect(() => {
    dispatch(createViewedTacticalActivitesEvent());
  }, [didMountState]);

  const allTacticalActivities: TacticalActivity[] = objectToArray(activities);

  const reorderActivities = dragResult => {
    console.log(dragResult);
    const dragSourceIndex = dragResult.source.index;
    const dragToIndex = dragResult.destination.index;
    if (dragSourceIndex !== dragToIndex) {
      const fromDude = allTacticalActivities[dragSourceIndex];
      fromDude.rank = dragToIndex;

      const wasPromotion = dragSourceIndex > dragToIndex;
      if(wasPromotion) {
        Array(dragSourceIndex - dragToIndex)
          .fill(0)
          .map((_,index)=> index + dragToIndex)
          .forEach(toDemote => ++allTacticalActivities[toDemote].rank)
      } else {
        Array(dragToIndex - dragSourceIndex)
          .fill(0)
          .map((_,index)=> index + dragSourceIndex + 1)
          .forEach(toDemote => --allTacticalActivities[toDemote].rank)
      }

      dispatch(createFetchedTacticalActivitesEvent(allTacticalActivities))
    }

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
            Activity Ranking
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Something short and leading about the collection below—its contents, the creator, etc.
            Make it short and sweet, but not too short so folks don&apos;t simply skip over it
            entirely.
          </Typography>
          <TacticalActivityIcon/>
        </Container>
      </div>
      <Button variant={'contained'}
              color={'primary'}
              className={classes.button}>
        <SaveIcon/> Save Order
      </Button>
      <div>
        <DragDropContext onDragEnd={reorderActivities}>
          <Droppable droppableId={'activityList'}>
            {
              provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <TacticalActivityList tacticalActivities={allTacticalActivities}
                                        classes={classes}/>
                  {provided.placeholder}
                </div>
              )
            }
          </Droppable>
        </DragDropContext>
      </div>
      <div className={classes.root}>
        <Grid container justify={'center'}>
          <Grid item>
            <Grid container
                  style={{flexGrow: 1}}
                  justify={'center'}
            >
              {
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
