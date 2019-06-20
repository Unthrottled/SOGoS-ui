import React from "react";
import {connect} from "react-redux";
import Activity from "./ActivityHub";
import ActivityFeed from "./ActivityFeed";
import LoggedInLayout from "./LoggedInLayout";

const LoggedIn = ({fullName}) => {
  return (
    <LoggedInLayout>
      <Activity/>
      <h3>What's up {fullName}?</h3>
      <ActivityFeed/>
    </LoggedInLayout>
  );
};

const mapStateToProps = state => {
  const {user: {information: {fullName}}} = state;
  return {
    fullName,
  }
};

export default connect(mapStateToProps)(LoggedIn);
