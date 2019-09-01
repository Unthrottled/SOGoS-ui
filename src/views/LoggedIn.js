import React from "react";
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import ActivityFeed from "./ActivityFeed";

const LoggedIn = ({fullName}) => {
  return (
    <LoggedInLayout>
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
