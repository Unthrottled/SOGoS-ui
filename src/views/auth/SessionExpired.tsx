import {connect, DispatchProp} from 'react-redux';
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import {GlobalState} from '../../reducers';
import {TransitionProps} from '@material-ui/core/transitions';
import {requestLogoff} from "../../events/SecurityEvents";

const Transition: React.ComponentType<TransitionProps> = React.forwardRef(
  function Transition(props, ref) {
    // @ts-ignore
    return <Slide direction={"up"} ref={ref} {...props} />;
  },
);
type Props = DispatchProp & {
  isExpired: boolean;
};
const SessionExpired = ({isExpired, dispatch: dispetch}: Props) => {
  const goToLogin = (): void => {
    dispetch(requestLogoff())
  };
  return (
    <Dialog
      open={isExpired}
      TransitionComponent={Transition}
      keepMounted
      onClose={goToLogin}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description">
      <DialogTitle id="alert-dialog-slide-title">
        {'Session Expired!'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Hey! Your session is expired. No big deal, just log in again, please.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={goToLogin} color="primary">
          Go to Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = (state: GlobalState) => {
  const {
    security: {isExpired},
  } = state;
  return {
    isExpired,
  };
};
export default connect(mapStateToProps)(SessionExpired);
