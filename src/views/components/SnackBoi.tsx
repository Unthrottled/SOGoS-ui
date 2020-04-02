import * as React from 'react';
import {FC} from 'react';
import {connect, DispatchProp} from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {SnackbarContent} from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import {amber} from '@material-ui/core/colors';
import Snackbar from '@material-ui/core/Snackbar';
import {GlobalState, selectMiscState} from '../../reducers';
import {createHideNotificationEvent} from '../../events/MiscEvents';
import green from "@material-ui/core/colors/green";
import {NotificationType} from '../../reducers/MiscellaneousReducer';

const useStyles = makeStyles(theme => ({
  container: {},
  snackBarWarn: {
    backgroundColor: amber[700],
  },
  snackBaInfo: {
    backgroundColor: green[700],
  },
  icon: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

type Props = DispatchProp & {
  shown: boolean;
  message: string;
  type: NotificationType;
};

const SnackBoi: FC<Props> = ({message, shown, type, dispatch}) => {
  const classes = useStyles();
  const onClose = () => {
    dispatch(createHideNotificationEvent());
  };

  return (
    <div className={classes.container}>
      <Snackbar
        open={shown}
        autoHideDuration={7000}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}>
        <SnackbarContent
          className={type === NotificationType.INFO ?
          classes.snackBaInfo : classes.snackBarWarn}
          message={
            <span className={classes.message}>
              {
                type === NotificationType.INFO ?
                  (<InfoIcon className={classes.icon}/>):
                  (<WarningIcon className={classes.icon} />)
              }
              {message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={onClose}>
              <CloseIcon className={classes.icon} />
            </IconButton>,
          ]}
        />
      </Snackbar>
    </div>
  );
};

const mapStateToProps = (state: GlobalState) => {
  const {
    notification: {message, shown, type},
  } = selectMiscState(state);
  return {
    message,
    shown,
    type,
  };
};

export default connect(mapStateToProps)(SnackBoi);
