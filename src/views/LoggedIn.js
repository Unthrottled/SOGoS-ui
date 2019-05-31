import React from "react";
import {connect} from "react-redux";
import {logout} from "../actions/SecurityActions";
import Activity from "./Activity";

const LoggedIn = ({fullName, dispatch: dispetch}) => {
  const logUserOut = (): void => {
    dispetch(logout());
  };
  return (
    <div>
      <Activity/>
      <h3>What's up {fullName}?</h3>
      There's a ninja with huge boobs over there.
      <button onClick={() => logUserOut()}>Logout</button>
    </div>
  );
};

const mapStateToProps = state => {
  const {user: {information: {fullName}}} = state;
  return {
    fullName,
  }
};

export default connect(mapStateToProps)(LoggedIn);
