import React, {FC} from 'react';
import {Grow, makeStyles} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

const useStyles = makeStyles(theme => ({
  container: {
    position: 'fixed',
    top: '25%',
    width: '100%',
    height: '100%',
  },
  paper: {
    maxWidth: '650px',
    margin: 'auto',
  },
}));

const TacModPlug: FC<Props> = ({visible, onDismiss}) => {
  const classes = useStyles();
  const dismissNotification = () => {
    // todo: dispetch TacModNotified
    onDismiss();
  };

  return (
    <Grow in={visible}>
      <div className={classes.container}>
        <Paper className={classes.paper}>
          <div>Hey use TacMod</div>
          <Button
            variant={'contained'}
            color={'primary'}
            onClick={dismissNotification}>
            K
          </Button>
        </Paper>
      </div>
    </Grow>
  );
};

export default TacModPlug;
