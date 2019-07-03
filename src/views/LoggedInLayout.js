import React from "react";
import MenuAppBar from "./MenuAppBar";
import ActivityTimer from "./ActivityTimer";
import SessionExpired from "./SessionExpired";
import Activity from "./ActivityHub";
import makeStyles from "@material-ui/core/styles/makeStyles";

const pickOne =[
  'https://acari.io/misc/9eccbbaf0461ecb3c044d582017dd6ee.jpg',
  'https://static1.e621.net/data/a3/be/a3beb6fd045222a7088e8c886b916ddb.png',
  'https://acari.io/misc/0ee2189a1b290267840e5cb90ff4a1d8.jpg',
];

const useStyles = makeStyles(theme =>({
  sharkTits: {
    background: `url(${pickOne[Math.floor(Math.random() * (pickOne.length + 1))]}) no-repeat center`,
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
