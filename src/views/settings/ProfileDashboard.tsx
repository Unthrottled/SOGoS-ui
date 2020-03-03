import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import LoggedInLayout from '../components/LoggedInLayout';
import Typography from '@material-ui/core/Typography';
import {Card, makeStyles} from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import AvatarIcon from "@material-ui/icons/Person";
import Avatar from "@material-ui/core/Avatar";
import AvatarComponent from "./AvatarComponent";
import CircularProgress from "@material-ui/core/CircularProgress";
import {green} from "@material-ui/core/colors";

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
  avatarContainer: {
    padding: theme.spacing(2),
    position: 'relative',
  },
  avatar: {
    width: 128,
    height: 128,
    margin: 'auto'
  },
  avatarProgress: {
    color: green[500],
    position: 'absolute',
    top: 0,
    left: '25%',
    zIndex: 1,
  },
}));

const ProfileDashboard = () => {
  const history = useHistory();
  const classes = useStyles();

  const [localUrl, setLocalUrl] = useState();

  const uploadCroppedImage = (avatarUrl: string) => {
    setLocalUrl(avatarUrl)
  }

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
            Profile
          </Typography>
          <AvatarIcon style={{color: '#333831', fontSize: '6rem'}}/>
        </Container>
      </div>
      <Card className={classes.card}>
        <div className={classes.cardContent}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Avatar
            </Typography>
            <AvatarComponent onImageSelect={uploadCroppedImage}/>
            <div className={classes.avatarContainer}>
              <div>
                <Avatar className={classes.avatar} src={localUrl}/>
                <CircularProgress size={159} className={classes.avatarProgress}/>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </LoggedInLayout>
  );
};

export default ProfileDashboard;
