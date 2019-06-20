import React, {useEffect, useState} from 'react';
import './App.css';
import {connect} from "react-redux";
import {appInitialized} from "../events/ApplicationLifecycleEvents";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";
import {ThemeProvider} from '@material-ui/styles'
import {createMuiTheme, responsiveFontSizes} from '@material-ui/core/styles';
import {green, purple} from "@material-ui/core/colors";
import {Route} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

const theme = responsiveFontSizes(createMuiTheme({
  palette: {
    primary: {
      ...purple,
      alertColor: '#f9ff75',
    },
    secondary: green,
  }
}));

function App({dispatch: dispetch, isInitialized}) {
  const [mounted] = useState(true);
  useEffect(() => {
    dispetch(appInitialized());
  }, [mounted]);
  return isInitialized ? (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div className={"Content"}>
          <PrivateRoute path={'/'} exact component={LoggedIn}/>
          <Route path={'/login'} component={LoggedOut}/>
        </div>
      </div>
    </ThemeProvider>
  ) : (<div/>);
}

const mapStateToProps = ({security: {isInitialized}}) => ({
  isInitialized
});

export default connect(mapStateToProps)(App);
