import React, {FC, useEffect, useState} from 'react';
import {connect, DispatchProp} from 'react-redux';
import LoggedInLayout from '../components/LoggedInLayout';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Slider from '@material-ui/core/Slider';
import {Typography} from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import {
  createUpdatedPomodoroSettingsEvent,
  createViewedSettingsEvent,
} from '../../events/TacticalEvents';
import {GlobalState, selectPomodoroState} from '../../reducers';
import Container from '@material-ui/core/Container';
import SettingsIcon from '@material-ui/icons/Settings';
import withStyles from '@material-ui/core/styles/withStyles';
import {TomatoIcon} from '../icons/TomatoIcon';
import {PersistActions} from '../components/PersistActions';
import {PomodoroSettings} from '../../types/TacticalTypes';
import {SliderProps} from '@material-ui/core/Slider/Slider';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    background: theme.palette.background.paper,
    color: theme.palette.common.black,
    borderRadius: theme.spacing(1),
  },
  cardContent: {
    maxWidth: theme.spacing(75),
    margin: 'auto',
    padding: theme.spacing(3),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  menu: {
    width: 350,
  },
  headerContent: {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0, 6),
    marginBottom: theme.spacing(1),
  },
}));

const restMarks = [
  {
    value: 0.5,
    label: '0.5',
  },
  {
    value: 3,
    label: '3',
  },
  {
    value: 5,
    label: '5',
  },
  {
    value: 10,
    label: '10',
  },
  {
    value: 20,
    label: '20',
  },
  {
    value: 30,
    label: '30',
  },
];

const recoveryMarks = [
  {
    value: 5,
    label: '5',
  },
  {
    value: 10,
    label: '10',
  },
  {
    value: 20,
    label: '20',
  },
  {
    value: 30,
    label: '30',
  },
  {
    value: 60,
    label: '60',
  },
];

export const MINUTE_CONVERSION = 60000;

const workMarks = [
  {
    value: 5,
    label: '5',
  },
  {
    value: 15,
    label: '15',
  },
  {
    value: 30,
    label: '30',
  },
  {
    value: 60,
    label: '60',
  },
  {
    value: 90,
    label: '90',
  },
];

const SliderBoi: React.ComponentType<SliderProps> = withStyles({
  thumb: {
    height: 20,
    width: 20,
    marginTop: -10,
    marginLeft: -10,
  },
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
})(Slider);

interface Props {
  pomodoroSettings: PomodoroSettings;
}

const SettingsBoard: FC<DispatchProp & Props> = ({
  dispatch,
  pomodoroSettings,
}) => {
  const classes = useStyles();
  useEffect(() => {
    dispatch(createViewedSettingsEvent());
  }, [dispatch]);
  const [recoveryTime, setRecoveryTime] = useState(
    pomodoroSettings.shortRecoveryDuration / MINUTE_CONVERSION,
  );

  const saveRecoveryTime: (
    event: React.ChangeEvent<{}>,
    value: number | number[],
  ) => void = (_, time) => {
    // @ts-ignore real
    setRecoveryTime(time);
  };

  const [longRecoveryTime, setLongRecoveryTime] = useState(
    pomodoroSettings.longRecoveryDuration / MINUTE_CONVERSION,
  );

  const saveLongRecoveryTime: (
    event: React.ChangeEvent<{}>,
    value: number | number[],
  ) => void = (_, time) => {
    // @ts-ignore real
    setLongRecoveryTime(time);
  };
  const [workTime, setWorkTime] = useState(
    pomodoroSettings.loadDuration / MINUTE_CONVERSION,
  );

  const saveWorkTime: (
    event: React.ChangeEvent<{}>,
    value: number | number[],
  ) => void = (_, time) => {
    // @ts-ignore real
    setWorkTime(time);
  };
  const cycleTimeMinutes = (workTime + recoveryTime) * 4 - recoveryTime;

  const history = useHistory();
  const saveSettings = () => {
    dispatch(
      createUpdatedPomodoroSettingsEvent({
        loadDuration: workTime * 60000,
        shortRecoveryDuration: recoveryTime * 60000,
        longRecoveryDuration: longRecoveryTime * 60000,
      }),
    );
    history.push('/');
  };

  const discardChanges = () => {
    history.push('/');
  };

  return (
    <LoggedInLayout>
      <div className={classes.headerContent}>
        <Container maxWidth={'sm'}>
          <Typography
            component={'h1'}
            variant={'h2'}
            align={'center'}
            color={'textPrimary'}
            gutterBottom>
            Settings
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="textSecondary"
            paragraph>
            We all cannot be the same. Therefore we thought it would be handy to
            allow you to adjust the experience to your preferences!
          </Typography>
          <SettingsIcon style={{color: 'black', fontSize: '3em'}} />
        </Container>
      </div>
      <div className={classes.container}>
        <div className={classes.cardContent}>
          <TomatoIcon size={{width: 50, height: 50}} />
          <Typography gutterBottom>Pomodoro Settings</Typography>
          <hr />
          <Typography gutterBottom color={'textSecondary'} variant={'caption'}>
            Work Duration (minutes)
          </Typography>
          <SliderBoi
            id={'pomodoro-work-time'}
            defaultValue={workTime}
            aria-labelledby="discrete-slider-always"
            step={0.5}
            onChangeCommitted={saveWorkTime}
            min={5}
            marks={workMarks}
            max={workMarks[workMarks.length - 1].value}
            valueLabelDisplay="auto"
          />
          <Typography gutterBottom color={'textSecondary'} variant={'caption'}>
            Short Break Duration (minutes)
          </Typography>
          <SliderBoi
            id={'pomodoro-recovery-time'}
            defaultValue={recoveryTime}
            aria-labelledby="discrete-slider-always"
            step={0.5}
            onChangeCommitted={saveRecoveryTime}
            min={0.5}
            marks={restMarks}
            max={restMarks[restMarks.length - 1].value}
            valueLabelDisplay="auto"
          />
          <Typography gutterBottom color={'textSecondary'} variant={'caption'}>
            Long Break Duration (minutes)
          </Typography>
          <SliderBoi
            id={'pomodoro-long-recovery-time'}
            defaultValue={longRecoveryTime}
            aria-labelledby="discrete-slider-always"
            step={0.5}
            onChangeCommitted={saveLongRecoveryTime}
            min={5}
            marks={recoveryMarks}
            max={recoveryMarks[recoveryMarks.length - 1].value}
            valueLabelDisplay="auto"
          />
          <hr />
          <div>
            <Typography>
              Full Cycle Time (4 iterations): {cycleTimeMinutes} minutes or{' '}
              {(cycleTimeMinutes / 60).toFixed(2)} hours
            </Typography>
          </div>
          <PersistActions onSave={saveSettings} onCancel={discardChanges} />
        </div>
      </div>
    </LoggedInLayout>
  );
};

const mapStateToProps = (state: GlobalState) => {
  const {settings} = selectPomodoroState(state);
  return {
    pomodoroSettings: settings,
  };
};

export default connect(mapStateToProps)(SettingsBoard);
