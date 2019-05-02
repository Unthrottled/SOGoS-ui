import React, { Component } from 'react';
import logo from '../logo.svg';
import './App.css';
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import {login, logout} from "../actions/SecurityActions";
import {appInitialized} from "../actions/ApplicationLifecycleActions";

class App extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    fullName: PropTypes.string.isRequired,
  };

  componentDidMount(): void {
    const {dispatch: dispetch} = this.props;
    dispetch(appInitialized());
  }

  logout(): void {
    const { dispatch: dispetch } = this.props;
    dispetch(logout())
  }

  login(): void {
    const { dispatch: dispetch } = this.props;
    dispetch(login())
  }

  render() {
    const {isLoggedIn, fullName} = this.props;
    return isLoggedIn ? (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h3> Welcome {fullName}!</h3>
          { isLoggedIn ?
            <button onClick={()=>this.logout()}>Logout</button> :
            <button onClick={()=>this.login()}>Login</button>
          }
        </header>
      </div>
    ): null;
  }
}
const mapStateToProps = state =>{
  const {security, user} = state;
  const {isLoggedIn} = security;
  const {information} = user;
  const {fullName} = information;

  return {
    isLoggedIn,
    fullName
  }
};

export default connect(mapStateToProps)(App);
