import React from "react";
import {connect} from "react-redux";
import Activity from "./ActivityHub";
import MenuAppBar from "./MenuAppBar";
import ActivityTimer from "./ActivityTimer";
import SessionExpired from "./SessionExpired";
import ActivityFeed from "./ActivityFeed";

const LoggedIn = ({fullName}) => {
  return (
    <div>
      <MenuAppBar/>
      <Activity/>
      <h3>What's up {fullName}?</h3>
      <ActivityFeed/>
      <ActivityTimer/>
      <SessionExpired/>
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
