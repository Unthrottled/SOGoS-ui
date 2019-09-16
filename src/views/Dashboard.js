import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import clsx from 'clsx';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import PieFlavored from "./PieFlavored";
import TimeLine from "./TimeLine";
import {viewedActivityFeed} from "../actions/HistoryActions";
import {TextField} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import Fab from "@material-ui/core/Fab";
import {createAdjustedHistoryTimeFrame} from "../events/HistoryEvents";

const drawerWidth = 240;


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    background: theme.palette.primary.dark,
    margin: 'auto',
    padding: theme.spacing(3),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  }
}));


const SEVEN_DAYS = 604800000;

const pad = number => {
  if (number < 10) {
    return '0' + number;
  }
  return number;
};

const getDateString = (date: Date) => {
  return date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds());
};

const Dashboard = ({dispatch}) => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [didMountState] = useState('');

  useEffect(() => {
    dispatch(viewedActivityFeed());
  }, [didMountState]);
  const meow = new Date();

  const meowISO = getDateString(meow);
  const meowMinusSevenISO = getDateString(new Date(meow.getTime() - SEVEN_DAYS));
  const [to, setTo] = useState(meowISO);
  const [from, setFrom] = useState(meowMinusSevenISO);

  const adjustTo = (value) =>{
    setTo(value.target.value);
  };

  const adjustFrom = (value) =>{
    setFrom(value.target.value);
  };

  const submitTimeFrame = () => {
    dispatch(createAdjustedHistoryTimeFrame(
      new Date(from).valueOf(),
      new Date(to).valueOf()
    ));
  };

  return (
    <LoggedInLayout>
      <main className={classes.content}>
        <div className={classes.appBarSpacer}/>
        <Container maxWidth="lg" className={classes.container}>
          <form className={classes.form} noValidate>
            <TextField
              id="datetime-local"
              label="From"
              type="datetime-local"
              defaultValue={from}
              className={classes.textField}
              onChange={adjustFrom}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="datetime-local"
              label="To"
              type="datetime-local"
              defaultValue={to}
              className={classes.textField}
              onChange={adjustTo}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Fab color={'primary'}
                 className={classes.save}
                 onClick={submitTimeFrame}
            >
              <DoneIcon/>
            </Fab>
          </form>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <div className={fixedHeightPaper}>
                <TimeLine/>
              </div>
            </Grid>
            <Grid item xs={12} md={8} lg={9}>
              <div className={fixedHeightPaper}>
                <PieFlavored/>
              </div>
            </Grid>
          </Grid>
        </Container>
      </main>
    </LoggedInLayout>
  );
};

const mapStateToProps = state => {
  const {user: {information: {fullName}}} = state;
  return {
    fullName,
  }
};

export default connect(mapStateToProps)(Dashboard);
