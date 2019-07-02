import React from "react";
import MenuAppBar from "./MenuAppBar";
import ActivityTimer from "./ActivityTimer";
import SessionExpired from "./SessionExpired";
import Activity from "./ActivityHub";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme =>({
  sharkTits: {
    background: 'url(https://static1.e621.net/data/a3/be/a3beb6fd045222a7088e8c886b916ddb.png)',
    height: '100%'
  }
}));

const LoggedInLayout = ({children, ...otherProperties}) => {
  const classes = useStyles();
  return (
    <div {...otherProperties} className={classes.sharkTits}>
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
