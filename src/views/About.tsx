import React, {FC} from 'react';
import {connect} from "react-redux";
import {Link, Typography} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {SOGoSSharedLogo} from "./history/SharedHistoryDashboardComponents";
import QuestionIcon from "@material-ui/icons/ContactSupport";
import {GoalIcon} from "./icons/GoalIcon";
import {ActivityIcon} from "./icons/ActivityIcon";
import HistoryIcon from "@material-ui/icons/History";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import {green, orange, purple} from "@material-ui/core/colors";
import {SOGoS} from "./icons/SOGoS";
import {themeStyles} from "./auth/LoggedOut";

interface Props {

}

// @ts-ignore real
const useStyles = makeStyles(theme => ({
  headerContent: {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0, 6),
    marginBottom: theme.spacing(1),
  },
  ...themeStyles,
}));

const About: FC<Props> = () => {
  const {headerContent} = useStyles();

  return (
    <div style={{
      height: '100%',
      margin: '1.5rem',
      marginBottom: '5rem',
    }}>
      <SOGoSSharedLogo/>
      <div
        style={{}}>
        <div
          style={{}}>
          <Container maxWidth={'lg'}>
            <div className={headerContent}>
              <Container
                maxWidth={'sm'}
                style={{}}>
                <Card style={{display: 'flex', textAlign: 'left', marginBottom: '1rem'}}>
                  <CardMedia style={{
                    backgroundColor: '#454545',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                    <div style={{padding: '2rem 1rem'}}>
                      <SOGoS size={{width: 64, height: 64}}/>
                    </div>
                  </CardMedia>
                  <CardContent style={{
                    backgroundColor: '#333333',
                    color: "#fff",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                    <Typography gutterBottom variant="h5">
                      What's in it for you?
                    </Typography>
                    <Typography
                      color={'inherit'}
                      gutterBottom>
                      Let us answer that question by asking more
                      questions! &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </Typography>
                  </CardContent>
                </Card>
                <Card style={{display: 'flex', textAlign: 'left', marginBottom: '1rem'}}>
                  <CardMedia style={{
                    backgroundColor: orange[400],
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                    <div style={{padding: '1rem'}}>
                      <QuestionIcon style={{fontSize: '64px', color: '#fff'}}/>
                    </div>
                  </CardMedia>
                  <CardContent style={{
                    backgroundColor: orange[600],
                    color: "#fff"
                  }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      What are you doing with your time?
                    </Typography>
                    <Typography
                      color={'inherit'}
                      gutterBottom>
                      <ul>
                        <li>Are you spending it on things that bring you the most value?</li>
                        <li>Are you unsure what to do?</li>
                        <li>Do you want to do too many things?</li>
                      </ul>
                    </Typography>
                  </CardContent>
                </Card>
                <Card style={{display: 'flex', textAlign: 'left', marginBottom: '1rem'}}>
                  <CardMedia style={{
                    backgroundColor: '#728eda',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                    <div style={{padding: '1rem'}}>
                      <GoalIcon size={{width: 64, height: 64}}/>
                    </div>
                  </CardMedia>
                  <CardContent style={{
                    color: '#fff',
                    backgroundColor: '#5f7dcb'
                  }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Figure out what is important!
                    </Typography>
                    <Typography
                      color={'inherit'}
                      gutterBottom>
                      Find goals that are difficult to accomplish.
                      Dig deep and shoot for the moon. Don't sandbag yourself, strive for
                      greatness!
                    </Typography>
                  </CardContent>
                </Card>
                <Card style={{display: 'flex', textAlign: 'left', marginBottom: '1rem'}}>
                  <CardMedia style={{
                    backgroundColor: green[400],
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                    <div style={{padding: '1rem'}}>
                      <ActivityIcon size={{width: 64, height: 64}}/>
                    </div>
                  </CardMedia>
                  <CardContent style={{
                    color: '#fff',
                    backgroundColor: green[600],
                  }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Take Action!
                    </Typography>
                    <Typography
                      color={'inherit'}
                      gutterBottom>
                      Goals are just wishful thoughts and happy daydreams without execution.
                      Define the activities that will get you to the top of your mountains.
                    </Typography>
                  </CardContent>
                </Card>
                <Card style={{display: 'flex', textAlign: 'left', marginBottom: '1rem'}}>
                  <CardMedia style={{
                    backgroundColor: purple[400],
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                    <div style={{padding: '1rem'}}>
                      <HistoryIcon style={{fontSize: '64px', color: '#fff'}}/>
                    </div>
                  </CardMedia>
                  <CardContent style={{
                    backgroundColor: purple[600],
                    color: '#fff',
                  }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Retrospect on activities of the past.
                    </Typography>
                    <Typography
                      color={'inherit'}
                      gutterBottom>
                      Use the data of your past to drive what you do today.
                      Figure out where you can optimize your efforts.
                      <strong> Most importantly, learn when you should be taking it easy.</strong>
                    </Typography>
                  </CardContent>
                </Card>
                <div>
                  <Typography variant={'h5'} color="textSecondary">
                    SOGos has fulfilled its purpose and has been sunset.
                  </Typography>
                  <Typography variant={'h5'} color="textSecondary">
                    For more information <Link href={'https://youtu.be/dQw4w9WgXcQ'}>follow this link.</Link>
                  </Typography>
                </div>
              </Container>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default connect()(About);
