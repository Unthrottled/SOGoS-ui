import React, {FC} from 'react';
// @ts-ignore
import {AutoRotatingCarousel, Slide} from 'material-auto-rotating-carousel';
import {green, grey, red} from '@material-ui/core/colors';
import PlayStore from '../../images/playstore.png';
import TacMod from '../../images/TacMod.png';
import Tomato from '../../images/Tomato.png';
import {useDispatch} from 'react-redux';
import {createAcknowledgedTacModEvent} from '../../events/ActivityEvents';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

const TacModPlug: FC<Props> = ({visible, onDismiss}) => {
  const dispatch = useDispatch();
  const dismissNotification = () => {
    onDismiss();
    dispatch(createAcknowledgedTacModEvent());
  };

  // todo: link to google play
  return (
    <AutoRotatingCarousel
      label="Got It!"
      autoplay={false}
      open={visible}
      onStart={dismissNotification}
      style={{position: 'absolute'}}>
      <Slide
        media={<img src={TacMod} />}
        mediaBackgroundStyle={{backgroundColor: green[400]}}
        style={{backgroundColor: green[600]}}
        title="Download TacMod!"
        subtitle="SOGoS's Tactical Module is a native mobile app that provides essential features."
      />
      <Slide
        media={<img src={Tomato} />}
        mediaBackgroundStyle={{backgroundColor: red[400]}}
        style={{backgroundColor: red[600]}}
        title="Enhanced Pomodoro Timer"
        subtitle="Due to technical limitations, SOGoS is unable to notify you when your pomodoro completes when your phone is asleep. TacMod does not have that issue!"
      />
      <Slide
        media={
          <div
            style={{cursor: 'pointer'}}
            onClick={() => alert('like a bauss')}>
            <img src={PlayStore} />
          </div>
        }
        mediaBackgroundStyle={{backgroundColor: grey[400]}}
        style={{backgroundColor: grey[600]}}
        title="Available on Android!"
        subtitle="Click the Google Play Button to download TacMod today, it's free!"
      />
    </AutoRotatingCarousel>
  );
};

export default TacModPlug;
