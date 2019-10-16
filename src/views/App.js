import React, {useEffect, useState} from 'react';
import './App.css';
import {connect} from "react-redux";
import {appInitialized} from "../events/ApplicationLifecycleEvents";
import LoggedOut from "./LoggedOut";
import {ThemeProvider} from '@material-ui/styles'
import {createMuiTheme, responsiveFontSizes} from '@material-ui/core/styles';
import {green, purple} from "@material-ui/core/colors";
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

const theme = responsiveFontSizes(createMuiTheme({
  palette: {
    primary: {
      ...purple,
      alertColor: '#f9ff75',
    },
    secondary: green,
  }
}));

const useStyles = makeStyles(theme => ({
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
      backgroundColor: purple["500"],
      outline: '1px solid slategrey'
    }
  }
}));

function App({dispatch: dispetch, isInitialized}) {
  const classes = useStyles();
  const [mounted] = useState(true);
  useEffect(() => {
    dispetch(appInitialized());
  }, [mounted]);
  return isInitialized ? (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div className={classes.content}>
          <Switch>
            <Route path={'/login'} component={LoggedOut}/>

            {/*todo: make this public*/}
            <PrivateRoute path={'/:uuid/history'} component={HistoryDashboard}/>

            <PrivateRoute path={'/settings'} component={Settings}/>
            <PrivateRoute path={'/strategy/objectives/:objectiveId/tactics/association'} component={ObjectiveActivityAssociationDashboard}/>
            <PrivateRoute path={'/strategy/objectives/:objectiveId'} component={ObjectiveDashboard}/>
            <PrivateRoute path={'/strategy/objectives'} component={ObjectivesDashboard}/>
            <PrivateRoute path={'/tactical/activities/rank/dashboard'} component={ActivitiesRankDashboard}/>
            <PrivateRoute path={'/tactical/activities/hidden'} component={HiddenActivitiesDashboard}/>
            <PrivateRoute path={'/tactical/activities/:activityId/strategy/association'} component={ActivityObjectiveAssociationDashboard}/>
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
}

const mapStateToProps = ({security: {isInitialized}}) => ({
  isInitialized
});

export default connect(mapStateToProps)(App);
