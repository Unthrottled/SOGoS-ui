import React, {useEffect, useState} from 'react';
import './App.css';
import {connect, DispatchProp} from "react-redux";
import {createApplicationInitializedEvent} from "../events/ApplicationLifecycleEvents";
import LoggedOut from "./LoggedOut";
import {ThemeProvider} from '@material-ui/styles'
import {createMuiTheme, responsiveFontSizes} from '@material-ui/core/styles';
import {amber, blue} from "@material-ui/core/colors";
import {Route, Switch} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import makeStyles from "@material-ui/core/styles/makeStyles";
import StrategicDashboard from "./StrategicDashboard";
import ObjectivesDashboard from "./ObjectivesDashboard";
import ObjectiveDashboard from "./ObjectiveDashboard";
import Settings from "./Settings";
import ActivityTimer from "./ActivityTimeBar";
import Dashboard from "./Dashboard";
import TacticalDashboard from "./TacticalDashboard";
import ActivitiesDashboard from "./ActivitiesDashboard";
import ActivityDashboard from "./ActivityDashboard";
import ObjectiveActivityAssociationDashboard from "./ObjectiveActivityAssociationDashboard";
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import HistoryDashboard from "./HistoryDashboard";
import ActivitiesRankDashboard from "./ActivitiesRankDashboard";
import ActivityObjectiveAssociationDashboard from "./ActivityObjectiveAssociationDashboard";
import HiddenActivitiesDashboard from "./HiddenActivitiesDashboard";
import {GlobalState, selectSecurityState} from "../reducers";
import {SecurityState} from "../reducers/SecurityReducer";

const theme = responsiveFontSizes(createMuiTheme({
  palette: {
    primary: {
      ...amber,
      //@ts-ignore
      alertColor: '#f9ff75',
    },
    secondary: blue,
  }
}));

const useStyles = makeStyles(_ => ({
  content: {
    height: '100%'
  },
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.4em'
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: amber["500"],
      outline: '1px solid slategrey'
    }
  }
}));

type Props = DispatchProp & {
  isInitialized: boolean,
};
const App = ({dispatch: dispetch, isInitialized}: Props) => {
  const classes = useStyles();
  const [mounted] = useState(true);
  useEffect(() => {
    dispetch(createApplicationInitializedEvent());
  }, [dispetch, mounted]);
  return isInitialized ? (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div className={classes.content}>
          <Switch>
            <Route path={'/login'} component={LoggedOut}/>

            {/*todo: make this public*/}
            <PrivateRoute path={'/:uuid/history'} component={HistoryDashboard}/>

            <PrivateRoute path={'/settings'} component={Settings}/>
            <PrivateRoute path={'/strategy/objectives/:objectiveId/tactics/association'}
                          component={ObjectiveActivityAssociationDashboard}/>
            <PrivateRoute path={'/strategy/objectives/:objectiveId'} component={ObjectiveDashboard}/>
            <PrivateRoute path={'/strategy/objectives'} component={ObjectivesDashboard}/>
            <PrivateRoute path={'/tactical/activities/rank/dashboard'} component={ActivitiesRankDashboard}/>
            <PrivateRoute path={'/tactical/activities/hidden'} component={HiddenActivitiesDashboard}/>
            <PrivateRoute path={'/tactical/activities/:activityId/strategy/association'}
                          component={ActivityObjectiveAssociationDashboard}/>
            <PrivateRoute path={'/tactical/activities/:activityId'} component={ActivityDashboard}/>
            <PrivateRoute path={'/tactical/activities'} component={ActivitiesDashboard}/>
            <PrivateRoute path={'/strategy'} component={StrategicDashboard}/>
            <PrivateRoute path={'/tactical'} component={TacticalDashboard}/>
            <PrivateRoute path={'/'} exact component={Dashboard}/>
            <Route component={() => (<h2>404</h2>)}/>
          </Switch>
          <ActivityTimer/>
        </div>
      </div>
    </ThemeProvider>
  ) : (<div/>);
};

const mapStateToProps = (globalState: GlobalState) => {
  const {isInitialized}: SecurityState = selectSecurityState(globalState);
  return ({
    isInitialized
  });
};

export default connect(mapStateToProps)(App);
