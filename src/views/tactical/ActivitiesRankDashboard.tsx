import React, {FC, useEffect, useState} from 'react';
import {connect, DispatchProp} from 'react-redux';
import LoggedInLayout from '../components/LoggedInLayout';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import {useHistory} from 'react-router-dom';
import {numberObjectToArray} from '../../miscellanous/Tools';
import {
  createReplaceActiveActivitesEvent,
  createReRankedTacticalActivitiesEvent,
  createViewedTacticalActivitesEvent,
} from '../../events/TacticalEvents';
import {
  GlobalState,
  selectTacticalActivityState,
  selectUserState,
} from '../../reducers';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {TacticalActivityIcon} from '../icons/TacticalActivityIcon';
import {Card} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {TacticalActivity} from '../../types/TacticalTypes';
import {NumberDictionary} from '../../types/BaseTypes';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    textAlign: 'left',
  },
  button: {
    margin: theme.spacing(1),
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
    padding: `${theme.spacing(0.5)}px 0px`,
  },
}));

interface RankProps {
  tacticalActivities: TacticalActivity[];
  tacticalActivity: TacticalActivity;
  moveItems: (arg1: number, arg2: number) => void;
  classes: any;
}

export const TacticalActivityRankComponent: FC<RankProps> = ({
  tacticalActivities,
  tacticalActivity,
  moveItems,
  classes,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const sendToTheTop = (rank: number) => {
    moveItems(rank, 0);
  };

  const sendToTheBottom = (rank: number) => {
    moveItems(rank, tacticalActivities.length - 1);
  };
  return (
    <Card>
      <div className={classes.content}>
        <div className={classes.activityAvatar}>
          <TacticalActivityIcon
            tacticalActivity={tacticalActivity}
            size={{
              width: '45px',
              height: '45px',
            }}
          />
        </div>
        <div className={classes.activityName}>{tacticalActivity.name}</div>
        <div>{tacticalActivity.rank + 1}</div>
        <div>
          <div>
            <IconButton
              aria-owns={open ? 'menu-appbar' : undefined}
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit">
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}>
              <MenuItem
                onClick={() => {
                  handleClose();
                  sendToTheTop(tacticalActivity.rank);
                }}>
                <ArrowUpwardIcon /> To the Top{' '}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  sendToTheBottom(tacticalActivity.rank);
                }}>
                <ArrowDownwardIcon /> To the Bottom
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </Card>
  );
};

interface ListProps {
  tacticalActivities: TacticalActivity[];
  moveItems: (arg1: number, arg2: number) => void;
  classes: any;
}

export const TacticalActivityList = ({
  tacticalActivities,
  moveItems,
  classes,
}: ListProps): JSX.Element[] => {
  return tacticalActivities.map((tacticalActivity, index) => (
    <Draggable
      key={tacticalActivity.id}
      draggableId={tacticalActivity.id}
      index={index}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={classes.activity}>
          <TacticalActivityRankComponent
            tacticalActivity={tacticalActivity}
            classes={classes}
            moveItems={moveItems}
            tacticalActivities={tacticalActivities}
          />
        </div>
      )}
    </Draggable>
  ));
};

const promoteActivities = (
  dragSourceIndex: number,
  dragToIndex: number,
  allTacticalActivities: TacticalActivity[],
) => {
  const wasPromotion = dragSourceIndex > dragToIndex;
  if (wasPromotion) {
    return Array(dragSourceIndex - dragToIndex)
      .fill(0)
      .map((_, index) => index + dragToIndex)
      .map(toDemote => {
        const activityToChange = allTacticalActivities[toDemote];
        ++activityToChange.rank;
        return activityToChange;
      });
  } else {
    return Array(dragToIndex - dragSourceIndex)
      .fill(0)
      .map((_, index) => index + dragSourceIndex + 1)
      .map(toDemote => {
        const activityToChange = allTacticalActivities[toDemote];
        --activityToChange.rank;
        return activityToChange;
      });
  }
};

interface Props {
  activities: NumberDictionary<TacticalActivity>;
}

const ActivitiesDashboard: FC<DispatchProp & Props> = ({
  activities,
  dispatch,
}) => {
  const classes = useStyles();
  useEffect(() => {
    dispatch(createViewedTacticalActivitesEvent());
  }, [dispatch]);

  const allTacticalActivities: TacticalActivity[] = numberObjectToArray(
    activities,
  );

  const moveItems = (dragSourceIndex: number, dragToIndex: number) => {
    if (dragSourceIndex !== dragToIndex) {
      const fromDude = allTacticalActivities[dragSourceIndex];
      fromDude.rank = dragToIndex;

      const changedActivities = promoteActivities(
        dragSourceIndex,
        dragToIndex,
        allTacticalActivities,
      );

      changedActivities.push(fromDude);

      dispatch(createReRankedTacticalActivitiesEvent(changedActivities));
      dispatch(createReplaceActiveActivitesEvent(allTacticalActivities));
    }
  };

  const reorderActivities = (dragResult: any) => {
    const dragSourceIndex = dragResult.source.index;
    const dragToIndex = dragResult.destination.index;
    moveItems(dragSourceIndex, dragToIndex);
  };

  const history = useHistory();
  return (
    <LoggedInLayout>
      <div className={classes.headerContent}>
        <Container maxWidth={'sm'}>
          <Typography
            component={'h1'}
            variant={'h2'}
            align={'center'}
            color={'textPrimary'}
            gutterBottom>
            Activity Ranking
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph>
            Not all activities are created equal. Place the activities you most
            often spend time on at the top.
          </Typography>
          <TacticalActivityIcon />
        </Container>
      </div>
      <Button
        variant={'contained'}
        color={'primary'}
        className={classes.button}
        onClick={() => history.push('../')}>
        <ArrowBackIcon /> Go back
      </Button>
      <div>
        <DragDropContext onDragEnd={reorderActivities}>
          <Droppable droppableId={'activityList'}>
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {TacticalActivityList({
                  tacticalActivities: allTacticalActivities,
                  moveItems: moveItems,
                  classes: classes,
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </LoggedInLayout>
  );
};

const mapStateToProps = (state: GlobalState) => {
  const {
    information: {fullName},
  } = selectUserState(state);
  const {activities} = selectTacticalActivityState(state);
  return {
    fullName,
    activities,
  };
};

export default connect(mapStateToProps)(ActivitiesDashboard);
