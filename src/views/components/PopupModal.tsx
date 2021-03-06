import * as React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import {TransitionProps} from '@material-ui/core/transitions';

export const Transition: React.ComponentType<TransitionProps> = React.forwardRef(
  function Transition(props, ref) {
    // @ts-ignore
    return <Slide direction="up" ref={ref} {...props} />;
  },
);

type Props = {
  open: boolean;
  onDismiss: () => void;
  title: string;
  onPositiveAction: () => void;
  onNegativeAction: () => void;
  positiveActionText: string;
  negativeActionText: string;
  contents: string;
};
export const PopupModal = (props: Props) => {
  return (
    <div>
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.onDismiss}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle id="alert-dialog-slide-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {props.contents}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onPositiveAction}>
            {props.positiveActionText}
          </Button>
          <Button onClick={props.onNegativeAction}>
            {props.negativeActionText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
