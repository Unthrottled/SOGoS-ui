import React, {FC} from 'react';
import {Grow, makeStyles} from '@material-ui/core';
import Button from '@material-ui/core/Button';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

const useStyles = makeStyles(theme => ({}));

const TacModPlug: FC<Props> = ({visible, onDismiss}) => {
  const classes = useStyles();
  const dismissNotification = () => {
    // todo: dispetch TacModNotified
    onDismiss();
  };

  return (
    <Grow in={visible}>
      <div>
        <div>Hey use TacMod</div>
        <Button
          variant={'contained'}
          color={'primary'}
          onClick={dismissNotification}>
          K
        </Button>
      </div>
    </Grow>
  );
};

export default TacModPlug;
