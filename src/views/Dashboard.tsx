import React from 'react';
import {connect} from 'react-redux';
import LoggedInLayout from './components/LoggedInLayout';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Container from '@material-ui/core/Container';
import {GlobalState, selectUserState} from '../reducers';
import {Card, Typography} from '@material-ui/core';
import {SOGoS} from './icons/SOGoS';
import Grid from '@material-ui/core/Grid';
import CardActionArea from '@material-ui/core/CardActionArea';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import SettingsIcon from '@material-ui/icons/Settings';
import CardContent from '@material-ui/core/CardContent';
import {History} from 'history';
import {HistoryIcon} from './icons/HistoryIcon';
import {GoalIcon} from './icons/GoalIcon';
import {ActivityIcon} from './icons/ActivityIcon';

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
    name: 'Goal Setting',
    description: 'Establish your endgame objectives.',
    icon: <GoalIcon />,
    navigator: (history: History, _: string) => () =>
      history.push('./strategy/objectives/'),
  },
  {
    name: 'Activity Definition',
    description: 'Catalog activities needed to reach your goals.',
    icon: <ActivityIcon />,
    navigator: (history: History, _: string) => () =>
      history.push('./tactical/activities/'),
  },
  {
    name: 'History',
    description: 'Take a look at how you spent your time.',
    icon: <HistoryIcon />,
    navigator: (history: History, guid: string) => () =>
      history.push(`./${guid}/history/`),
  },
  {
    name: 'Settings',
    description: 'Tailor the experience to your abilities.',
    icon: <SettingsIcon style={{fontSize: '100px', color: '#333831'}} />,
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
            Welcome{fullName ? ` ${fullName}` : ''}!
          </Typography>
          <SOGoS />
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
