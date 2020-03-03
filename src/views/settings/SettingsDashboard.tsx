import React from 'react';
import {useHistory} from 'react-router-dom';
import LoggedInLayout from '../components/LoggedInLayout';
import Typography from '@material-ui/core/Typography';
import {Card, makeStyles} from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import {TacticalActivityIcon} from '../icons/TacticalActivityIcon';
import Container from '@material-ui/core/Container';
import {TacticalIcon} from '../icons/TacticalIcon';
import SettingsIcon from "@material-ui/icons/Settings";
import AvatarIcon from "@material-ui/icons/Person";
import {TomatoIcon} from "../icons/TomatoIcon";

const useStyles = makeStyles(theme => ({
  cardContent: {
    maxWidth: 345,
    margin: 'auto',
  },
  card: {
    width: '100%',
    marginBottom: '1rem',
  },
  headerContent: {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0, 6),
    marginBottom: theme.spacing(1),
  },
  goalIcon: {
    padding: theme.spacing(2),
  },
}));

const SettingsDashboard = () => {
  const history = useHistory();
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
            Settings
          </Typography>
          <SettingsIcon style={{color: '#333831', fontSize: '6rem'}} />
        </Container>
      </div>
      <Card className={classes.card}>
        <CardActionArea onClick={() => history.push('./profile/')}>
          <div className={classes.cardContent}>
            <div className={classes.goalIcon}>
              <AvatarIcon style={{color: '#333831', fontSize: '6rem'}} />
            </div>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Profile
              </Typography>
              <Typography
                gutterBottom
                variant="body2"
                color="textSecondary"
                component="p">
                Want your pretty face to show up in the application?
                Then be sure to complete your profile!
              </Typography>
            </CardContent>
          </div>
        </CardActionArea>
      </Card>
      <Card className={classes.card}>
        <CardActionArea onClick={() => history.push('./pomodoro/')}>
          <div className={classes.cardContent}>
            <div className={classes.goalIcon}>
              <TomatoIcon size={{
                width: '100px',
                height: '100px',
              }}/>
            </div>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Pomodoro Settings
              </Typography>
              <Typography
                gutterBottom
                variant="body2"
                color="textSecondary"
                component="p">
                Do the default pomodoro settings not work for you?
                Feel free to adjust them here!
              </Typography>
            </CardContent>
          </div>
        </CardActionArea>
      </Card>
    </LoggedInLayout>
  );
};

export default SettingsDashboard;
