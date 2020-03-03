import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import LoggedInLayout from '../components/LoggedInLayout';
import Typography from '@material-ui/core/Typography';
import {Card, makeStyles} from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Container from '@material-ui/core/Container';
import AvatarIcon from "@material-ui/icons/Person";
import CloudIcon from "@material-ui/icons/CloudUpload";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";

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
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  }
}));

const ProfileDashboard = () => {
  const history = useHistory();
  const classes = useStyles();

  const [localUrl, setLocalUrl] = useState();

  const imageSelected = (e: any) => {
    setLocalUrl(URL.createObjectURL(
      e.target.files?.[0]
    ))
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
              <input type={'file'} onChange={imageSelected}/>
              <IconButton>
                <CloudIcon/>
              </IconButton>
            </CardContent>
            <div className={classes.goalIcon}>
              <Avatar className={classes.avatar} src={localUrl}/>
            </div>
          </div>
      </Card>
    </LoggedInLayout>
  );
};

export default ProfileDashboard;
