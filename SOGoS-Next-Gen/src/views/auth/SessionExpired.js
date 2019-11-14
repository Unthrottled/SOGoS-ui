import {connect} from "react-redux";
import React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import {login} from "../actions/SecurityActions";
import Button from "@material-ui/core/Button";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SessionExpired = ({isExpired, dispatch: dispetch}) => {
  const goToLogin = (): void =>{
    dispetch(login())
  };
return (
  <Dialog
    open={isExpired}
    TransitionComponent={Transition}
    keepMounted
    onClose={goToLogin}
    aria-labelledby="alert-dialog-slide-title"
    aria-describedby="alert-dialog-slide-description"
  >
    <DialogTitle id="alert-dialog-slide-title">{"Session Expired!"}</DialogTitle>
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
)
};

const mapStateToProps = (state : GlobalState) => {
  const {security: {isExpired}} = state;
  return {
    isExpired
  };
};
export default connect(mapStateToProps)(SessionExpired);
