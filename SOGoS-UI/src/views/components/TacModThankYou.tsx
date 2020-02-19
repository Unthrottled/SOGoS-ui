import React, {FC} from 'react';
import confetti from 'canvas-confetti';
import {Dialog} from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {GlobalState, selectUserState} from '../../reducers';
import {connect, useDispatch} from 'react-redux';
import {createThankedForDownloadingTacModEvent} from "../../events/ActivityEvents";

function getConfetti(x: number, y: number) {
  return confetti({
    particleCount: 100,
    spread: 360,
    origin: {
      x,
      y,
    },
  });
}

interface Props {
  name?: string;
  tacModDownloaded?: boolean;
  tacModThanked?: boolean;
}

const TacModThankYou: FC<Props> = ({name, tacModDownloaded, tacModThanked}) => {
  const dispatch = useDispatch();
  const boom = () => {
    dispatch(createThankedForDownloadingTacModEvent());
    getConfetti(0.6, 0.2);
    setTimeout(() => {
      getConfetti(0.2, 0.6);
      setTimeout(() => getConfetti(0.8, 0.8), 500);
    }, 500);
  };

  const yourName = name ? `${name}, thank you` : 'Hey You! Thanks';
  const myName =
    yourName.toLowerCase().indexOf('alex') > -1 ? 'another Alex' : 'Alex';

  return (
    <Dialog open={!tacModThanked && !!tacModDownloaded}>
      <DialogTitle>Thank you so much!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {yourName} for taking the time to download TacMod. It means a lot to
          me. I wanted to take the time tell you that you are awesome! -{myName}
        </DialogContentText>
        <DialogActions>
          <Button color={'secondary'} onClick={boom}>
            Get back to business
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = (state: GlobalState): Props => {
  const {
    information: {firstName},
    miscellaneous: {
      onboarding: {TacModThanked, TacModDownloaded},
    },
  } = selectUserState(state);
  return {
    name: firstName,
    tacModDownloaded: TacModDownloaded,
    tacModThanked: TacModThanked,
  };
};

export default connect(mapStateToProps)(TacModThankYou);
