import React, {FC, useEffect, useState} from 'react';
import {HistoryIcon} from "../icons/HistoryIcon";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Container from "@material-ui/core/Container";
import InputLabel from "@material-ui/core/InputLabel";
import {DateRangePicker, FocusedInputShape} from "react-dates";
import moment, {Moment} from "moment";
import {Activity, getActivityName} from "../../types/ActivityTypes";
import TimeLine from "./TimeLine";
import PieFlavored from "./PieFlavored";
import WeeklyHeatMap from "./WeeklyHeatMap";
import Loader from "react-loader-spinner";
import {PRIMARY_THEME_COLOR} from "../App";
import {connect, DispatchProp, useSelector} from "react-redux";
import {GlobalState, selectHistoryState, selectUserState} from "../../reducers";
import {createAdjustedHistoryTimeFrame, createViewedHistoryEvent} from "../../events/HistoryEvents";
import {ONE_DAY} from "../../sagas/activity/PomodoroActivitySagas";
import makeStyles from "@material-ui/core/styles/makeStyles";

interface Props {
  selectedTo: number;
  selectedFrom: number;
  bottomActivity?: Activity;
}

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
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
    color: theme.palette.text.primary,
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


const HistoryDashboardComponents: FC<DispatchProp & Props> = (
  {
    dispatch,
    selectedTo,
    selectedFrom,
    bottomActivity,
  }
) => {
  const classes = useStyles();

  useEffect(() => {
    dispatch(createViewedHistoryEvent());
  }, [dispatch]);

  const meow = moment.unix(selectedTo / 1000);
  const meowMinusSeven = moment.unix(selectedFrom / 1000);
  const timeSpan = moment.duration(meow.diff(meowMinusSeven));

  const [focusedInput, setFocusedInput] = useState<FocusedInputShape | null>(
    null,
  );

  const submitTimeFrame = (from: Moment, to: Moment) => {
    const fromUnix = from.valueOf();
    const toUnix = to.valueOf() + ONE_DAY - 1000;
    dispatch(
      createAdjustedHistoryTimeFrame({
        from: new Date(fromUnix).valueOf(),
        to: new Date(toUnix).valueOf(),
      }),
    );
  };

  const {
    information: {firstName},
  } = useSelector(selectUserState);

  return (
    <div>
      <HistoryIcon size={{width: 50, height: 50}}/>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon/>}
          aria-controls="panel1a-content"
          id="panel1a-header">
          <div style={{margin: 'auto'}}>
            <Typography variant={'h5'}>
              {capitalize(timeSpan.humanize())} in {firstName}'s past.
            </Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Container maxWidth={'sm'}>
            <div className={classes.form}>
              <InputLabel>Active Time Range</InputLabel>
              <DateRangePicker
                startDate={meowMinusSeven}
                startDateId="steve"
                endDate={meow}
                isOutsideRange={date => moment().isSameOrBefore(date, 'day')}
                endDateId="jerry"
                onDatesChange={({startDate, endDate}) =>
                  submitTimeFrame(startDate || moment(), endDate || moment())
                }
                focusedInput={focusedInput}
                onFocusChange={setFocusedInput}
              />
            </div>
          </Container>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      {!!bottomActivity && !!getActivityName(bottomActivity) ? (
        <main className={classes.content}>
          <div className={classes.paper}>
            <TimeLine/>
          </div>
          <div className={classes.paper}>
            <PieFlavored/>
          </div>
          <div className={classes.paper}>
            <WeeklyHeatMap/>
          </div>
        </main>
      ) : (
        <div
          style={{
            opacity: 0.7,
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}>
          <Loader
            type={'Triangle'}
            color={PRIMARY_THEME_COLOR}
            height={256}
            width={256}
          />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: GlobalState): Props => {
  const {
    selectedHistoryRange: {from, to},
  } = selectHistoryState(state);
  const {
    capstone: {bottomActivity},
  } = selectHistoryState(state);
  return {
    selectedFrom: from,
    selectedTo: to,
    bottomActivity,
  };
};


export default connect(mapStateToProps)(HistoryDashboardComponents);
