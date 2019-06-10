import React, {useEffect, useState} from 'react';
import logo from '../logo.svg';
import './App.css';
import {connect} from "react-redux";
import {appInitialized} from "../events/ApplicationLifecycleEvents";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";
import {ThemeProvider} from '@material-ui/styles'
import {createMuiTheme, responsiveFontSizes} from '@material-ui/core/styles';
import {green, purple} from "@material-ui/core/colors";

const theme = responsiveFontSizes(createMuiTheme({
  palette: {
    primary: {
      ...purple,
      alertColor: '#f9ff75',
    },
    secondary: green,
  }
}));

function App({isLoggedIn, dispatch: dispetch}) {
  const [mounted] = useState(true);
  useEffect(() => {
    dispetch(appInitialized());
  }, [mounted]);
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div className={"Content"}>
          {isLoggedIn ? <LoggedIn/> : <LoggedOut/>}
          <img src={logo} className="App-logo" alt="logo"/>
        </div>
      </div>
    </ThemeProvider>
  );
}

const mapStateToProps = state => {
  const {security: {isLoggedIn}, configuration: {oauth}} = state;
  return {
    isLoggedIn,
    oauth
  }
};

export default connect(mapStateToProps)(App);
