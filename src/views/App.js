import React, {useEffect, useState} from 'react';
import logo from '../logo.svg';
import './App.css';
import {connect} from "react-redux";
import {appInitialized} from "../events/ApplicationLifecycleEvents";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";
import MenuAppBar from "./MenuAppBar";

function App({isLoggedIn, oauth, dispatch: dispetch}) {
  const isAppInitialized = oauth.authorizationEndpoint;
  const [mounted] = useState(true);
  useEffect(() => {
    dispetch(appInitialized());
  }, [mounted]);
  return isAppInitialized ? (
    <div className="App">
      <MenuAppBar/>
      <div className={"Content"}>
        <img src={logo} className="App-logo" alt="logo"/>
        {isLoggedIn ? <LoggedIn/> : <LoggedOut/>}
      </div>
    </div>
  ) : <div/>;
}

const mapStateToProps = state => {
  const {security: {isLoggedIn}, configuration: {oauth}} = state;
  return {
    isLoggedIn,
    oauth
  }
};

export default connect(mapStateToProps)(App);
