import React from "react";
import MenuAppBar from "./MenuAppBar";
import ActivityTimer from "./ActivityTimer";
import SessionExpired from "./SessionExpired";
import Activity from "./ActivityHub";

const LoggedInLayout = ({children, ...otherProperties}) => {
  return (
    <div {...otherProperties}>
      <MenuAppBar/>
      <Activity/>
      {
        children
      }
      <ActivityTimer/>
      <SessionExpired/>
    </div>
  );
};

export default LoggedInLayout;
