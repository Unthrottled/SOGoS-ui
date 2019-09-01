import React from "react";
import MenuAppBar from "./MenuAppBar";
import SessionExpired from "./SessionExpired";
import Activity from "./ActivityHub";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PausedPomodoro from "./PausedPomodoro";

const useStyles = makeStyles(theme =>({
  container: {
    height: '100%'
  }
}));

const LoggedInLayout = ({children, ...otherProperties}) => {
  const classes = useStyles();
  return (
    <div {...otherProperties} className={classes.container}>
      <MenuAppBar/>
      <Activity/>
      {
        children
      }
      <PausedPomodoro/>
      <SessionExpired/>
    </div>
  );
};

export default LoggedInLayout;
