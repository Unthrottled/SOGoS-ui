import React, {FC} from 'react';
import MenuAppBar from './MenuAppBar';
import SessionExpired from '../auth/SessionExpired';
import Activity from '../time/ActivityHub';
import makeStyles from '@material-ui/core/styles/makeStyles';
import PausedPomodoro from '../time/PausedPomodoro';
import SnackBoi from './SnackBoi';
import {Container} from '@material-ui/core';
import TacModThankYou from "./TacModThankYou";

const useStyles = makeStyles(theme => ({
  container: {
    minHeight: '100%',
    marginBottom: theme.spacing(9),
  },
  content: {
    marginTop: -theme.spacing(5),
  },
}));

const LoggedInLayout: FC = ({children, ...otherProperties}) => {
  const classes = useStyles();
  return (
    <div {...otherProperties} className={classes.container}>
      <MenuAppBar />
      <TacModThankYou/>
      <Activity />
      <Container className={classes.content} maxWidth={'lg'}>
        {children}
      </Container>
      <PausedPomodoro />
      <SessionExpired />
      <SnackBoi />
    </div>
  );
};

export default LoggedInLayout;
