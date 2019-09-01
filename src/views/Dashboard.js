import React from "react";
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import ActivityFeed from "./ActivityFeed";

const Dashboard = ({}) => {
  return (
    <LoggedInLayout>
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

export default connect(mapStateToProps)(Dashboard);
