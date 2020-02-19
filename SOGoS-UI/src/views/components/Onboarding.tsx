import React, {FC} from 'react';
// @ts-ignore
import {AutoRotatingCarousel, Slide} from 'material-auto-rotating-carousel';
import {
  amber,
  blue,
  cyan,
  green,
  grey,
  orange,
  purple,
  red,
} from '@material-ui/core/colors';
import Confetti from '../../images/confetti.png';
import {connect, useDispatch} from 'react-redux';
import {createWelcomedUserEvent} from '../../events/ActivityEvents';
import {GlobalState, selectUserState} from '../../reducers';
import {SOGoS} from '../icons/SOGoS';
import QuestionIcon from '@material-ui/icons/ContactSupport';
import ChartIcon from '@material-ui/icons/InsertChart';
import {GoalIcon} from '../icons/GoalIcon';
import {ActivityIcon} from '../icons/ActivityIcon';

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
        mediaBackgroundStyle={{backgroundColor: '#454545', whiteSpace: 'pre'}}
        style={{backgroundColor: '#333333'}}
        title={`Welcome${name ? ' ' + name : ''}!`}
        subtitle="Let's figure out what SOGoS can do for us!"
      />
      <Slide
        media={<QuestionIcon style={{fontSize: '256px', color: '#fff'}} />}
        mediaBackgroundStyle={{backgroundColor: orange[400]}}
        style={{backgroundColor: orange[600]}}
        title="What am I doing?"
        subtitle="Are you spending your time on things that give you the most value?
        Are you unsure what to do or wanting to do too much?"
      />
      <Slide
        media={<GoalIcon size={{width: 256, height: 256}} />}
        mediaBackgroundStyle={{backgroundColor: '#728eda'}}
        style={{backgroundColor: '#5f7dcb'}}
        title="Figure out what is important!"
        subtitle="
            Find goals that are difficult to accomplish.
            Dig deep and shoot for the moon. Don't sandbag yourself, strive for
            greatness!
          "
      />
      <Slide
        media={<ActivityIcon size={{width: 256, height: 256}} />}
        mediaBackgroundStyle={{backgroundColor: green[400]}}
        style={{backgroundColor: green[600]}}
        title="Take Action!"
        subtitle="Goals are just wishful thoughts and happy daydreams without execution.
        Define the activities that will get you to the top of your mountains."
      />
      <Slide
        media={<ChartIcon style={{fontSize: '256px', color: '#fff'}} />}
        mediaBackgroundStyle={{backgroundColor: purple[400]}}
        style={{backgroundColor: purple[600]}}
        title="Retrospect"
        subtitle="Use the data of your past to drive what you do today.
        Figure out where you can optimize your efforts.
        Most importantly, learn when you should be taking it easy.
         "
      />
      <Slide
        media={<img alt={'confetti'} src={Confetti} />}
        mediaBackgroundStyle={{backgroundColor: cyan[400]}}
        style={{backgroundColor: cyan[600]}}
        title="That's it!"
        subtitle="
        Short and to the point.
        Go forth and do awesome things!
        "
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
