import React, { Component } from 'react';
import logo from '../logo.svg';
import './App.css';
import {connect} from "react-redux";
import PropTypes from 'prop-types';

class App extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
  };

  render() {
    const {isLoggedIn} = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          { isLoggedIn && <button>Logout</button>}
        </header>
      </div>
    );
  }
}
const mapStateToProps = state =>{
  const {security} = state;
  const {isLoggedIn} = security;

  return {
    isLoggedIn
  }
};

export default connect(mapStateToProps)(App);
