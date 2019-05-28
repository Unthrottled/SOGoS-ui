import React, {Component} from 'react';
import logo from '../logo.svg';
import './App.css';
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import {login } from "../events/SecurityEvents";
import {appInitialized} from "../events/ApplicationLifecycleEvents";
import LoggedIn from "./LoggedIn";

class App extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    fullName: PropTypes.string.isRequired,
    oauth: PropTypes.object.isRequired,
  };

  componentDidMount(): void {
    const {dispatch: dispetch} = this.props;
    dispetch(appInitialized());
  }

  login(): void {
    const { dispatch: dispetch } = this.props;
    dispetch(login())
  }

  render() {
    const {isLoggedIn, oauth} = this.props;
    const isAppInitialized = oauth.authorizationEndpoint;
    return isAppInitialized ? (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          { isLoggedIn ?
             <LoggedIn/>:
            <button onClick={()=>this.login()}>Login</button>
          }
        </header>
      </div>
    ): null;
  }
}
const mapStateToProps = state =>{
  const {security, user, configuration} = state;
  const {isLoggedIn} = security;
  const {information} = user;
  const {fullName} = information;
  const { oauth } = configuration;

  return {
    isLoggedIn,
    fullName,
    oauth
  }
};

export default connect(mapStateToProps)(App);
