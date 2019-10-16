import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import {makeStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import uuid from 'uuid/v4';
import {Link, withRouter} from "react-router-dom";
import {createViewedTacticalActivitesEvent} from "../events/TacticalEvents";
import {TacticalActivityIcon} from "./TacticalActivityIcon";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import ActivityList from "./ActivityList";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from '@material-ui/icons/Settings';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

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
  },
  activity: {
    padding: theme.spacing(2),
  },
}));


export const TacticalActivitySettingsComponent = ({
                                                    tacticalActivity,
                                                    history,
                                                  }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (<div>
    <IconButton
      aria-owns={open ? 'menu-appbar' : undefined}
      aria-haspopup="true"
      onClick={handleMenu}
      color="inherit"
    >
      <SettingsIcon/>
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
      onClose={handleClose}
    >
      <MenuItem onClick={() => {
        handleClose();
        history.push(`./${tacticalActivity.id}`)
      }}>Edit </MenuItem>
      <MenuItem onClick={() => {
        handleClose();
      }}>Hide</MenuItem>
    </Menu>
  </div>);
};


const ActivitiesDashboard = ({dispatch, history}) => {
  const classes = useStyles();
  const [didMountState] = useState('');
  useEffect(() => {
    dispatch(createViewedTacticalActivitesEvent());
  }, [didMountState]);
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
      <Link to={`./${uuid()}`} style={{textDecoration: 'none'}}>
        <Button variant={'contained'}
                color={'primary'}
                className={classes.button}>
          <AddIcon/> Create
        </Button>
      </Link>
      <Link to={`./rank/dashboard`} style={{textDecoration: 'none'}}>
        <Button variant={'contained'}
                color={'primary'}
                className={classes.button}>
          <FormatListNumberedIcon/> Order
        </Button>
      </Link>
      <Link to={`./hidden`} style={{textDecoration: 'none'}}>
        <Button variant={'contained'}
                color={'primary'}
                className={classes.button}>
          <VisibilityOffIcon/> Hidden
        </Button>
      </Link>
      <ActivityList
        actionComponent={tacticalActivity => (
          <TacticalActivitySettingsComponent
            tacticalActivity={tacticalActivity}
            history={history}
          />
        )}
      />
    </LoggedInLayout>
  );
};

const mapStateToProps = _ => {
  return {}
};

export default connect(mapStateToProps)(withRouter(ActivitiesDashboard));
