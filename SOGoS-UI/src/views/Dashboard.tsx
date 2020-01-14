import React from 'react';
import {connect} from 'react-redux';
import LoggedInLayout from './components/LoggedInLayout';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Container from '@material-ui/core/Container';
import {GlobalState, selectUserState} from '../reducers';
import {Card, Typography} from '@material-ui/core';
import {Reach} from './icons/Reach';
import Grid from '@material-ui/core/Grid';
import CardActionArea from '@material-ui/core/CardActionArea';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {StrategyIcon} from './icons/StrategyIcon';
import {TacticalIcon} from './icons/TacticalIcon';
import SettingsIcon from '@material-ui/icons/Settings';
import CardContent from '@material-ui/core/CardContent';
import {History} from 'history';
import {HistoryIcon} from './icons/HistoryIcon';

const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
  },
  headerContent: {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0, 6),
    marginBottom: theme.spacing(1),
  },
  placeIcon: {
    padding: theme.spacing(2),
  },
  gridItem: {
    padding: theme.spacing(1),
    width: theme.spacing(40),
  },
}));

const placesToGo = [
  {
    name: 'Strategy',
    description:
      'What does it mean to succeed? Establish your endgame objectives here.',
    icon: <StrategyIcon />,
    navigator: (history: History, _: string) => () =>
      history.push('./strategy/'),
  },
  {
    name: 'Tactics',
    description:
      'How do you reach your endgame? Catalog activities needed to reach your goals here.',
    icon: <TacticalIcon />,
    navigator: (history: History, _: string) => () =>
      history.push('./tactical/'),
  },
  {
    name: 'History',
    description: 'Look at how far you have come and all of your achievements!',
    icon: <HistoryIcon />,
    navigator: (history: History, guid: string) => () =>
      history.push(`./${guid}/history/`),
  },
  {
    name: 'Settings',
    description:
      'Everybody is different. Tailor the experience to your abilities.',
    icon: <SettingsIcon style={{fontSize: '100px'}} />,
    navigator: (history: History, _: string) => () =>
      history.push('./settings/'),
  },
];
type Props = RouteComponentProps & {
  fullName: string;
  guid: string;
};
const Dashboard = ({fullName, guid, history}: Props) => {
  const classes = useStyles();

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
            SOGoS
          </Typography>
          <Typography color={'textSecondary'} gutterBottom>
            Strategic Orchestration and Governance System
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph>
            Welcome{fullName ? ` ${fullName}` : ''}! Figure out where you want
            to excel. Then push yourself to your limits. Knowing you can find
            your optimal recovery window, for maximum periodization.
          </Typography>
          <Reach />
        </Container>
      </div>
      <main className={classes.content}>
        <Grid container justify={'center'}>
          <Grid item>
            <Grid container style={{flexGrow: 1}} justify={'center'}>
              {placesToGo.map(placeToGo => (
                <Grid
                  item
                  xs={6}
                  className={classes.gridItem}
                  key={placeToGo.name}>
                  <Card>
                    <CardActionArea
                      onClick={placeToGo.navigator(history, guid)}>
                      <div className={classes.placeIcon}>{placeToGo.icon}</div>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {placeToGo.name}
                        </Typography>
                        <Typography
                          gutterBottom
                          variant="body2"
                          color="textSecondary"
                          component="p">
                          {placeToGo.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </main>
    </LoggedInLayout>
  );
};

const mapStateToProps = (state: GlobalState) => {
  const {
    information: {fullName, guid},
  } = selectUserState(state);
  return {
    fullName,
    guid,
  };
};

export default connect(mapStateToProps)(withRouter(Dashboard));
