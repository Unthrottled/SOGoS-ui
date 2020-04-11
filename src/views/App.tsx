import React, {useEffect, useState} from 'react';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import './App.css';
import {useDispatch, useSelector} from 'react-redux';
import {createApplicationInitializedEvent} from '../events/ApplicationLifecycleEvents';
import LoggedOut from './auth/LoggedOut';
import {ThemeProvider} from '@material-ui/styles';
import {createMuiTheme, responsiveFontSizes} from '@material-ui/core/styles';
import {blue} from '@material-ui/core/colors';
import {Route, Switch} from 'react-router-dom';
import PrivateRoute from './auth/PrivateRoute';
import makeStyles from '@material-ui/core/styles/makeStyles';
import StrategicDashboard from './strategic/StrategicDashboard';
import ObjectivesDashboard from './strategic/ObjectivesDashboard';
import ObjectiveDashboard from './strategic/ObjectiveDashboard';
import PomodoroSettingsBoard from './settings/PomodoroSettings';
import ActivityTimer from './time/ActivityTimeBar';
import Dashboard from './Dashboard';
import TacticalDashboard from './tactical/TacticalDashboard';
import ActivitiesDashboard from './tactical/ActivitiesDashboard';
import ActivityDashboard from './tactical/ActivityDashboard';
import ObjectiveActivityAssociationDashboard from './strategic/ObjectiveActivityAssociationDashboard';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import HistoryDashboard from './history/PrivateHistoryDashboard';
import ActivitiesRankDashboard from './tactical/ActivitiesRankDashboard';
import ActivityObjectiveAssociationDashboard from './tactical/ActivityObjectiveAssociationDashboard';
import HiddenActivitiesDashboard from './tactical/HiddenActivitiesDashboard';
import {GlobalState, selectSecurityState} from '../reducers';
import {SecurityState} from '../reducers/SecurityReducer';
import OutOfSync from './components/OutOfSync';
import Banner from './components/Banner';
import About from "./About";
import SharedHistoryDashboard from "./history/SharedHistoryDashboard";
import SettingsDashboard from "./settings/SettingsDashboard";
import ProfileDashboard from "./settings/ProfileDashboard";
import PrivateSharedHistoryDashboard from "./history/PrivateSharedHistoryDashboard";
import Typography from "@material-ui/core/Typography";

export const PRIMARY_THEME_COLOR = '#f9c048';
const theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      primary: {
        main: PRIMARY_THEME_COLOR,
        //@ts-ignore real
        alertColor: '#f9ff75',
      },
      secondary: blue,
    },
  }),
);

const useStyles = makeStyles(_ => ({
  content: {
    height: '100%',
  },
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.4em',
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: PRIMARY_THEME_COLOR,
      outline: '1px solid slategrey',
    },
  },
}));

const mapStateToProps = (globalState: GlobalState) => {
  const {isInitialized, isOutOfSync}: SecurityState = selectSecurityState(
    globalState,
  );
  return {
    isInitialized,
    isOutOfSync,
  };
};

const App = () => {
  const classes = useStyles();
  const [mounted] = useState(true);
  const {isInitialized, isOutOfSync} = useSelector(mapStateToProps);

  const dispetch = useDispatch();
  useEffect(() => {
    dispetch(createApplicationInitializedEvent());
  }, [dispetch, mounted]);

  const getComponent = () => {
    if (isOutOfSync) {
      return <OutOfSync/>;
    } else if (!isInitialized) {
      return <Banner/>;
    } else {
      return (
        <div className="App">
          <div className={classes.content}>
            <Switch>
              <Route path={'/login'} component={LoggedOut}/>
              <Route path={'/about'} component={About}/>
              <Route path={'/dashboard/:shareId'}
                     component={SharedHistoryDashboard}/>

              <PrivateRoute
                path={'/:uuid/history/shared'}
                component={PrivateSharedHistoryDashboard}
              />
              <PrivateRoute
                path={'/:uuid/history'}
                component={HistoryDashboard}
              />

              <PrivateRoute path={'/settings/pomodoro'} component={PomodoroSettingsBoard}/>
              <PrivateRoute path={'/settings/profile'} component={ProfileDashboard}/>
              <PrivateRoute path={'/settings'} component={SettingsDashboard}/>
              <PrivateRoute
                path={'/strategy/objectives/:objectiveId/tactics/association'}
                component={ObjectiveActivityAssociationDashboard}
              />
              <PrivateRoute
                path={'/strategy/objectives/:objectiveId'}
                component={ObjectiveDashboard}
              />
              <PrivateRoute
                path={'/strategy/objectives'}
                component={ObjectivesDashboard}
              />
              <PrivateRoute
                path={'/tactical/activities/rank/dashboard'}
                component={ActivitiesRankDashboard}
              />
              <PrivateRoute
                path={'/tactical/activities/hidden'}
                component={HiddenActivitiesDashboard}
              />
              <PrivateRoute
                path={'/tactical/activities/:activityId/strategy/association'}
                component={ActivityObjectiveAssociationDashboard}
              />
              <PrivateRoute
                path={'/tactical/activities/:activityId'}
                component={ActivityDashboard}
              />
              <PrivateRoute
                path={'/tactical/activities'}
                component={ActivitiesDashboard}
              />
              <PrivateRoute path={'/strategy'} component={StrategicDashboard}/>
              <PrivateRoute path={'/tactical'} component={TacticalDashboard}/>
              <PrivateRoute path={'/'} exact component={Dashboard}/>
              <Route component={() => (
                <Banner navigateable hideExcerpt>
                  <Typography variant={'h5'} color="textSecondary">
                    The page you are looking for does not exist, sorry!
                  </Typography>
                </Banner>
              )}/>
            </Switch>
            <ActivityTimer/>
          </div>
        </div>
      );
    }
  };

  return <ThemeProvider theme={theme}>{getComponent()}</ThemeProvider>;
};

export default App;
