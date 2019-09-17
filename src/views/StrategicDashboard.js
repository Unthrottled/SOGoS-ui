import React from "react";
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import Typography from "@material-ui/core/Typography";
import {Link} from "react-router-dom";

const StrategicDashboard = ({fullName}) => {
  return (
    <LoggedInLayout>
      <h3>What's up {fullName}?</h3>
      <Typography>
        Time to stratergize.
      </Typography>
      <Link to={'./objectives/'}>View Objectives</Link>
    </LoggedInLayout>
  );
};

const mapStateToProps = state => {
  const {user: {information: {fullName}}} = state;
  return {
    fullName,
  }
};

export default connect(mapStateToProps)(StrategicDashboard);
