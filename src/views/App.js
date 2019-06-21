import React, {useEffect, useState} from 'react';
import './App.css';
import {connect} from "react-redux";
import {appInitialized} from "../events/ApplicationLifecycleEvents";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";
import {ThemeProvider} from '@material-ui/styles'
import {createMuiTheme, responsiveFontSizes} from '@material-ui/core/styles';
import {green, purple} from "@material-ui/core/colors";
import {Route, Switch} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import LoggedInLayout from "./LoggedInLayout";
import makeStyles from "@material-ui/core/styles/makeStyles";
import StrategicDashboard from "./StrategicDashboard";
import ObjectivesDashboard from "./ObjectivesDashboard";
import ObjectiveDashboard from "./ObjectiveDashboard";

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
  sharkTits: {
    background: 'url(https://static1.e621.net/data/a3/be/a3beb6fd045222a7088e8c886b916ddb.png)',
    height: '100%'
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
            <PrivateRoute path={'/tits'} component={() => (
              <LoggedInLayout className={classes.sharkTits}>
              </LoggedInLayout>
            )}/>
            <Route path={'/login'} component={LoggedOut}/>
            <PrivateRoute path={'/strategy/objectives/:objectiveId'} component={ObjectiveDashboard}/>
            <PrivateRoute path={'/strategy/objectives'} component={ObjectivesDashboard}/>
            <PrivateRoute path={'/strategy'} component={StrategicDashboard}/>
            <PrivateRoute path={'/'} exact component={LoggedIn}/>
            <Route component={() => (<h2>404</h2>)}/>
          </Switch>
        </div>
      </div>
    </ThemeProvider>
  ) : (<div/>);
}

const mapStateToProps = ({security: {isInitialized}}) => ({
  isInitialized
});

export default connect(mapStateToProps)(App);
