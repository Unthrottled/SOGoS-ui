import React from "react";
import {connect} from "react-redux";
import Activity from "./Activity";
import MenuAppBar from "./MenuAppBar";
import ActivityTimer from "./ActivityTimer";

const LoggedIn = ({fullName}) => {
  return (
    <div>
      <MenuAppBar/>
      <Activity/>
      <h3>What's up {fullName}?</h3>
      There's a ninja with huge boobs over there.
      <ActivityTimer/>
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