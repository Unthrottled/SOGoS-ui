import React, {FC} from 'react';
// @ts-ignore
import {AutoRotatingCarousel, Slide} from 'material-auto-rotating-carousel';
import {cyan, green, orange, purple} from '@material-ui/core/colors';
import Confetti from '../../images/confetti.png';
import {connect, useDispatch} from 'react-redux';
import {createWelcomedUserEvent} from '../../events/ActivityEvents';
import {GlobalState, selectUserState} from '../../reducers';
import {SOGoS} from '../icons/SOGoS';
import QuestionIcon from '@material-ui/icons/ContactSupport';
import HistoryIcon from '@material-ui/icons/History';
import {GoalIcon} from '../icons/GoalIcon';
import {ActivityIcon} from '../icons/ActivityIcon';

interface Props {
  name?: string;
  email?: string;
  welcomed?: boolean;
}

const Onboarding: FC<Props> = ({email, name, welcomed}) => {
  const dispatch = useDispatch();
  const dismissWelcome = () => {
    dispatch(createWelcomedUserEvent());
  };

  return (
    <AutoRotatingCarousel
      label="Start using SOGoS!"
      autoplay={false}
      open={!welcomed && !!email}
      onStart={dismissWelcome}
      style={{position: 'absolute'}}>
      <Slide
        media={<SOGoS size={{width: 256, height: 256}} />}
        mediaBackgroundStyle={{backgroundColor: '#454545', whiteSpace: 'pre'}}
        style={{backgroundColor: '#333333'}}
        title={`Welcome${name ? ' ' + name : ''}!`}
        subtitle="Let's figure out what SOGoS can do for you!"
      />
      <Slide
        media={<QuestionIcon style={{fontSize: '256px', color: '#fff'}} />}
        mediaBackgroundStyle={{backgroundColor: orange[400]}}
        style={{backgroundColor: orange[600]}}
        title="What are you doing?"
        subtitle="Are you spending time on things that bring you the most value?
        Are you unsure what to do? Do you want to do too much?"
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
        media={<HistoryIcon style={{fontSize: '256px', color: '#fff'}} />}
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
    information: {firstName, email},
    miscellaneous: {
      onboarding: {welcomed},
    },
  } = selectUserState(state);
  return {
    name: firstName,
    email,
    welcomed,
  };
};

export default connect(mapStateToProps)(Onboarding);
