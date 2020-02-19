import React, {FC} from 'react';
// @ts-ignore
import {AutoRotatingCarousel, Slide} from 'material-auto-rotating-carousel';
import {green, grey, red} from '@material-ui/core/colors';
import PlayStore from '../../images/playstore.png';
import Tomato from '../../images/Tomato.png';
import {connect, useDispatch} from 'react-redux';
import {createWelcomedUserEvent} from '../../events/ActivityEvents';
import {GlobalState, selectUserState} from '../../reducers';
import {SOGoS} from '../icons/SOGoS';

interface Props {
  name?: string;
  welcomed?: boolean;
}

const Onboarding: FC<Props> = ({name, welcomed}) => {
  const dispatch = useDispatch();
  const dismissWelcome = () => {
    dispatch(createWelcomedUserEvent());
  };

  return (
    <AutoRotatingCarousel
      label="Got It!"
      autoplay={false}
      open={!welcomed}
      onStart={dismissWelcome}
      style={{position: 'absolute'}}>
      <Slide
        media={<SOGoS size={{width: 256, height: 256}} />}
        mediaBackgroundStyle={{backgroundColor: '#454545'}}
        style={{backgroundColor: '#333333'}}
        title="Welcome!"
        subtitle="Let's figure out, what SOGoS can do for , together!"
      />
      <Slide
        media={<img src={Tomato} />}
        mediaBackgroundStyle={{backgroundColor: red[400]}}
        style={{backgroundColor: red[600]}}
        title="Enhanced Pomodoro Timer"
        subtitle="Due to technical limitations, SOGoS is unable to notify you when your pomodoro completes when your phone is asleep. TacMod does not have that issue!"
      />
    </AutoRotatingCarousel>
  );
};

const mapStateToProps = (state: GlobalState): Props => {
  const {
    information: {firstName},
    miscellaneous: {
      onboarding: {welcomed},
    },
  } = selectUserState(state);
  return {
    name: firstName,
    welcomed,
  };
};

export default connect(mapStateToProps)(Onboarding);
