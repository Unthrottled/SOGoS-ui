import React, { Component } from 'react';
import logo from '../logo.svg';
import './App.css';
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import {logout, wheresWaldo} from "../actions";

class App extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    fullName: PropTypes.string.isRequired,
  };

  componentDidMount(): void {
    const {dispatch: dispetch} = this.props;
    dispetch(wheresWaldo());
  }

  logout(): void {
    const { dispatch: dispetch } = this.props;
    dispetch(logout())
  }

  render() {
    const {isLoggedIn, fullName} = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h3> Welcome {fullName}!</h3>
          { isLoggedIn && <button onClick={()=>this.logout()}>Logout</button>}
        </header>
      </div>
    );
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
