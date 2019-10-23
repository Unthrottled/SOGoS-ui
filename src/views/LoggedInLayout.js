import React from "react";
import MenuAppBar from "./MenuAppBar";
import SessionExpired from "./SessionExpired";
import Activity from "./ActivityHub";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PausedPomodoro from "./PausedPomodoro";
import SnackBoi from "./SnackBoi";
import {Container} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  container: {
    minHeight: '100%',
    marginBottom: theme.spacing(9),
  },
  content: {
    marginTop: -theme.spacing(5),
  },
}));

const LoggedInLayout = ({children, ...otherProperties}) => {
  const classes = useStyles();
  return (
    <div {...otherProperties} className={classes.container}>
      <MenuAppBar/>
      <Activity/>
      <Container className={classes.content} maxWidth={"lg"}>
        {
          children
        }
      </Container>
      <PausedPomodoro/>
      <SessionExpired/>
      <SnackBoi/>
    </div>
  );
};

export default LoggedInLayout;
