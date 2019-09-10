// @flow
import * as React from 'react';
import {connect} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {SnackbarContent} from "@material-ui/core";
import WarningIcon from '@material-ui/icons/Warning';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";
import {amber} from "@material-ui/core/colors";
import Snackbar from "@material-ui/core/Snackbar";
import {selectMiscState} from "../reducers";
import {createHideNotificationEvent} from "../events/MiscEvents";

const useStyles = makeStyles(theme => ({
  container: {

  },
  snackBar: {
    backgroundColor: amber[700],
  },
  icon: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  }
}));

const SnackBoi = ({message, shown, dispatch}) => {
  const classes = useStyles();
  const onClose = () => {
      dispatch(createHideNotificationEvent())
  };

  return (
    <div className={classes.container}>
      <Snackbar open={shown}
                autoHideDuration={7000}
                onClose={onClose}
                anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}>
        <SnackbarContent
          className={classes.snackBar}
          message={
            <span className={classes.message}>
            <WarningIcon className={classes.icon}/>
              {message}
          </span>
          }
          action={
            [<IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
              <CloseIcon className={classes.icon}/>
            </IconButton>,]}
        />
      </Snackbar>
    </div>
  );
};


const mapStateToProps = state => {
  const {notification: {message, shown}} = selectMiscState(state);
  return {
    message,
    shown
  };
};

export default connect(mapStateToProps)(SnackBoi);