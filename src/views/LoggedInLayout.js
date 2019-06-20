import React from "react";
import MenuAppBar from "./MenuAppBar";
import ActivityTimer from "./ActivityTimer";
import SessionExpired from "./SessionExpired";

const LoggedInLayout = ({children}) => {
  return (
    <div>
      <MenuAppBar/>
      {
        children
      }
      <ActivityTimer/>
      <SessionExpired/>
    </div>
  );
};

export default LoggedInLayout;
