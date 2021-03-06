import React, {FC, useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import LoggedInLayout from '../components/LoggedInLayout';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import {
  createShowTacticalActivityEvent,
  createViewedTacticalActivitesEvent,
} from '../../events/TacticalEvents';
import {TacticalActivityIcon} from '../icons/TacticalActivityIcon';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import ActivityList from './ActivityList';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import VisibilityIcon from '@material-ui/icons/Visibility';
import MenuItem from '@material-ui/core/MenuItem';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
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
  menuIcon: {
    marginRight: theme.spacing(1),
  },
}));

interface SettingsProps {
  tacticalActivity: TacticalActivity;
  classes: any;
  dispetch: any;
  history: any;
}

export const TacticalActivitySettingsComponent: FC<SettingsProps> = ({
  tacticalActivity,
  dispetch,
  classes,
  history,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

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
            dispetch(createShowTacticalActivityEvent(tacticalActivity));
          }}>
          Show{' '}
          <VisibilityIcon
            style={{marginLeft: '8px'}}
            className={classes.menuIcon}
          />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            history.push(`./${tacticalActivity.id}`);
          }}>
          Edit <EditIcon style={{marginLeft: '20px'}} />
        </MenuItem>
      </Menu>
    </div>
  );
};

const HiddenActivitiesDashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(createViewedTacticalActivitesEvent());
  }, [dispatch]);
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
            Activity Archive
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph>
            These are activities that you have done in the past and still want
            to remember you did them. We just put them here so they don't get in
            the way of your current activities.
          </Typography>
          <TacticalActivityIcon />
        </Container>
      </div>
      <Button
        variant={'contained'}
        color={'primary'}
        className={classes.button}
        onClick={() => history.push('/tactical/activities/')}>
        <ArrowBackIcon /> Go back
      </Button>
      <ActivityList
        hidden
        actionComponent={tacticalActivity => (
          <TacticalActivitySettingsComponent
            tacticalActivity={tacticalActivity}
            history={history}
            dispetch={dispatch}
            classes={classes}
          />
        )}
      />
    </LoggedInLayout>
  );
};

const mapStateToProps = (_: GlobalState) => {
  return {};
};

export default connect(mapStateToProps)(HiddenActivitiesDashboard);
