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
import {DateRangePicker} from 'react-dates';
import {ONE_DAY} from "../sagas/activity/PomodoroActivitySagas";
import InputLabel from "@material-ui/core/InputLabel";
import HistoryIcon from '@material-ui/icons/History';

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
  content: {
    flexGrow: 1,
    overflow: 'auto',
  },
  container: {},
  paper: {
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(0.5),
  },
  fixedHeight: {
    marginTop: theme.spacing(1),
    minHeight: 240,
    maxHeight: 500,
  },
  placeIcon: {
    padding: theme.spacing(2),
    color: theme.palette.common.black,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    margin: 'auto',
    padding: theme.spacing(3),
  },
  headerContent: {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0, 6),
    marginBottom: theme.spacing(1),
  },
}));


const HistoryDashboard = ({dispatch, selectedTo, selectedFrom}) => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [didMountState] = useState('');

  useEffect(() => {
    dispatch(viewedActivityFeed());
  }, [didMountState]);

  const meow = moment.unix(selectedTo / 1000);
  const meowMinusSeven = moment.unix(selectedFrom / 1000);

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
          <div className={classes.form} noValidate>
            <InputLabel>Active Time Range</InputLabel>
            <DateRangePicker
              startDate={meowMinusSeven}
              startDateId="steve"
              endDate={meow}
              minDate={moment.unix(0)}
              maxDate={moment()}
              isOutsideRange={(date) => moment().isSameOrBefore(date, 'day')}
              endDateId="jerry"
              onDatesChange={({startDate, endDate}) => submitTimeFrame(startDate, endDate + ONE_DAY - 1000)}
              focusedInput={focusedInput}
              onFocusChange={setFocusedInput}
            />
          </div>
        </Container>
        <div className={classes.placeIcon}>
          <HistoryIcon style={{fontSize: '100px'}}/>
        </div>
      </div>
      <main className={classes.content}>
        <div className={fixedHeightPaper}>
          <TimeLine/>
        </div>
        <div className={fixedHeightPaper}>
          <PieFlavored/>
        </div>
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

export default connect(mapStateToProps)(HistoryDashboard);
