import React, {FC, useEffect, useState} from 'react';
import {connect, DispatchProp} from 'react-redux';
import LoggedInLayout from '../components/LoggedInLayout';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import uuid from 'uuid/v4';
import {Link, useHistory} from 'react-router-dom';
import {
  createHideTacticalActivityEvent,
  createViewedTacticalActivitesEvent,
} from '../../events/TacticalEvents';
import {TacticalActivityIcon} from '../icons/TacticalActivityIcon';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import ActivityList from './ActivityList';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {TacticalActivity} from '../../types/TacticalTypes';
import {GlobalState} from '../../reducers';

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
  },
  activity: {
    padding: theme.spacing(2),
  },
}));

interface SettingsProps {
  tacticalActivity: TacticalActivity;
}

export const TacticalActivitySettingsComponent: FC<
  DispatchProp & SettingsProps
> = ({tacticalActivity, dispatch: dispetch}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory();

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
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
            history.push(`./${tacticalActivity.id}`);
          }}>
          Edit <EditIcon style={{marginLeft: '8px'}} />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            dispetch(createHideTacticalActivityEvent(tacticalActivity));
          }}>
          Hide
          <VisibilityOffIcon style={{marginLeft: '8px'}} />
        </MenuItem>
      </Menu>
    </div>
  );
};

const ActivitiesDashboard: FC<DispatchProp> = ({dispatch}) => {
  const classes = useStyles();
  useEffect(() => {
    dispatch(createViewedTacticalActivitesEvent());
  }, [dispatch]);
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
            Activity Hub
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph>
            These are all the things you do. Whether they be related to a goal
            or not, keep track of time spent!
          </Typography>
          <TacticalActivityIcon />
        </Container>
      </div>
      <Link to={`./${uuid()}`} style={{textDecoration: 'none'}}>
        <Button
          variant={'contained'}
          color={'primary'}
          className={classes.button}>
          <AddIcon /> Create
        </Button>
      </Link>
      <Link to={'./rank/dashboard'} style={{textDecoration: 'none'}}>
        <Button
          variant={'contained'}
          color={'primary'}
          className={classes.button}>
          <FormatListNumberedIcon /> Order
        </Button>
      </Link>
      <Link to={'./hidden'} style={{textDecoration: 'none'}}>
        <Button
          variant={'contained'}
          color={'primary'}
          className={classes.button}>
          <VisibilityOffIcon style={{marginRight: '2px'}} /> Hidden
        </Button>
      </Link>
      <ActivityList
        actionComponent={tacticalActivity => (
          <TacticalActivitySettingsComponent
            tacticalActivity={tacticalActivity}
            dispatch={dispatch}
          />
        )}
      />
    </LoggedInLayout>
  );
};

const mapStateToProps = (_: GlobalState) => {
  return {};
};

export default connect(mapStateToProps)(ActivitiesDashboard);
