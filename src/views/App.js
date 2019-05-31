import React, {Component} from 'react';
import logo from '../logo.svg';
import './App.css';
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import {appInitialized} from "../events/ApplicationLifecycleEvents";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";
import MenuAppBar from "./MenuAppBar";

class App extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    oauth: PropTypes.object.isRequired,
  };

  componentDidMount(): void {
    const {dispatch: dispetch} = this.props;
    dispetch(appInitialized());
  }

  render() {
    const {isLoggedIn, oauth} = this.props;
    const isAppInitialized = oauth.authorizationEndpoint;
    return isAppInitialized ? (
      <div className="App">
        <MenuAppBar/>
        <img src={logo} className="App-logo" alt="logo"/>
        {isLoggedIn ? <LoggedIn/> : <LoggedOut/>}
      </div>
    ) : null;
  }
}

const mapStateToProps = state => {
  const {security: {isLoggedIn}, configuration: {oauth}} = state;
  return {
    isLoggedIn,
    oauth
  }
};

export default connect(mapStateToProps)(App);
