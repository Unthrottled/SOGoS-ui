import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import clsx from 'clsx';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Container from "@material-ui/core/Container";
import PieFlavored from "./PieFlavored";
import TimeLine from "./TimeLine";
import {viewedActivityFeed} from "../actions/HistoryActions";
import moment from 'moment';
import {createAdjustedHistoryTimeFrame} from "../events/HistoryEvents";
import {selectHistoryState, selectUserState} from "../reducers";
import { DateRangePicker } from 'react-dates';
import {ONE_DAY} from "../sagas/activity/PomodoroActivitySagas";
import {Typography} from "@material-ui/core";
import {TacticalIcon} from "./TacticalIcon";
import {Reach} from "./Reach";

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
    // paddingTop: theme.spacing(4),
    // paddingBottom: theme.spacing(4),
  },
  paper: {
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    minHeight: 240,
    maxHeight: 500,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    margin: 'auto',
    padding: theme.spacing(3),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  headerContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0, 6),
    marginBottom: theme.spacing(1),
  },
}));


const Dashboard = ({dispatch, selectedTo, selectedFrom}) => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [didMountState] = useState('');

  useEffect(() => {
    dispatch(viewedActivityFeed());
  }, [didMountState]);

  const meow = moment.unix(selectedTo/1000);
  const meowMinusSeven = moment.unix(selectedFrom/1000);

  const [focusedInput, setFocusedInput] = useState(null);

  const submitTimeFrame = (from, to) => {
    dispatch(createAdjustedHistoryTimeFrame(
      new Date(from).valueOf(),
      new Date(to).valueOf()
    ));
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
            SOGoS
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Something short and leading about the collection below—its contents, the creator, etc.
            Make it short and sweet, but not too short so folks don&apos;t simply skip over it
            entirely.
          </Typography>
          <Reach />
        </Container>
      </div>
      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
          <div className={classes.form} noValidate>
            <Typography component={'h4'}
                        variant={'h4'}
                        gutterBottom>Activity Time Frame</Typography>
            <DateRangePicker
              startDate={meowMinusSeven}
              startDateId="steve"
              endDate={meow}
              minDate={moment.unix(0)}
              maxDate={moment()}
              isOutsideRange={(date)=> moment().isSameOrBefore(date, 'day')}
              endDateId="jerry"
              onDatesChange={({startDate, endDate}) => submitTimeFrame(startDate, endDate + ONE_DAY - 1000)}
              focusedInput={focusedInput}
              onFocusChange={setFocusedInput}
            />
          </div>
          <div className={fixedHeightPaper}>
            <TimeLine/>
          </div>
          <div className={fixedHeightPaper}>
            <PieFlavored/>
          </div>
        </Container>
      </main>
    </LoggedInLayout>
  );
};

const mapStateToProps = state => {
  const {information: {fullName}} = selectUserState(state);
  const {selectedHistoryRange: {from, to}} = selectHistoryState(state);
  return {
    fullName,
    selectedFrom: from,
    selectedTo: to
  }
};

export default connect(mapStateToProps)(Dashboard);
