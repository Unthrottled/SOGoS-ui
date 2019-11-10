import React from "react";
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";

const LoggedIn = () => {
  return (
    <LoggedInLayout>
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
