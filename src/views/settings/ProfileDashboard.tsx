import React, {FC, useEffect, useState} from 'react';
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
import {connect, useDispatch} from "react-redux";
import {createUploadAvatarEvent} from "../../events/UserEvents";
import {GlobalState, selectMiscState, selectUserState} from "../../reducers";
import {UploadStatus} from "../../reducers/MiscellaneousReducer";

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
    left: '24.5%',
    zIndex: 1,
  },
}));

interface Props {
  uploadStatus?: UploadStatus;
  localAvatar?: string;
}

const ProfileDashboard: FC<Props> = ({
                                       uploadStatus,
                                       localAvatar,
                                     }) => {
  const classes = useStyles();

  const [localUrl, setLocalUrl] = useState();
  useEffect(() => {
    setLocalUrl(localAvatar);
  }, [localAvatar])

  const dispetch = useDispatch();
  const uploadCroppedImage = (avatarUrl: string) => {
    dispetch(createUploadAvatarEvent(avatarUrl));
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
                {
                  uploadStatus === UploadStatus.UPLOADING &&
                  <CircularProgress size={159} className={classes.avatarProgress}/>
                }
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </LoggedInLayout>
  );
};

const mapStateToProps = (globalState: GlobalState): Props => {
  const {
    avatarUpload: {
      uploadStatus
    }
  } = selectMiscState(globalState);
  const {
    information: {
      localAvatar
    }
  } = selectUserState(globalState)
  return {
    uploadStatus,
    localAvatar,
  }
}

export default connect(mapStateToProps)(ProfileDashboard);
