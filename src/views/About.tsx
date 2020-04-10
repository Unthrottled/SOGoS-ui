import React, {FC} from 'react';
import {connect} from "react-redux";
import {GlobalState} from "../reducers";
import {Typography} from "@material-ui/core";
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

interface Props {

}

const useStyles = makeStyles(theme => ({
  headerContent: {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0, 6),
    marginBottom: theme.spacing(1),
  },
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
          style={{
          }}>
          <Container maxWidth={'lg'}>
            <div className={headerContent}>
              <Container
                maxWidth={'sm'}
                style={{}}>
                <Typography
                  color={'textPrimary'}
                  gutterBottom>
                  Let's figure out what SOGoS can do for you, by asking a few questions.
                </Typography>
                <Card style={{display: 'flex', textAlign: 'left', marginBottom: '1rem'}}>
                  <CardMedia style={{
                    margin: 'auto'
                  }}>
                    <div style={{padding: '1rem'}}>
                      <QuestionIcon style={{fontSize: '64px', color: '#00000055'}}/>
                    </div>
                  </CardMedia>
                  <CardContent>
                    <Typography
                      color={'textPrimary'}
                      gutterBottom>
                      <ul>
                        <li>What are you doing?</li>
                        <li>Are you spending time on things that bring you the most value?</li>
                        <li>Are you unsure what to do?</li>
                        <li>Do you want to do too much?</li>
                      </ul>
                    </Typography>
                  </CardContent>
                </Card>
                <Card style={{display: 'flex', textAlign: 'left', marginBottom: '1rem'}}>
                  <CardMedia style={{
                    margin: 'auto'
                  }}>
                    <div style={{padding: '1rem'}}>
                      <GoalIcon size={{width: 64, height: 64}}/>
                    </div>
                  </CardMedia>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Figure out what is important!
                    </Typography>
                    <Typography
                      color={'textPrimary'}
                      gutterBottom>
                      Find goals that are difficult to accomplish.
                      Dig deep and shoot for the moon. Don't sandbag yourself, strive for
                      greatness!
                    </Typography>
                  </CardContent>
                </Card>
                <Card style={{display: 'flex', textAlign: 'left', marginBottom: '1rem'}}>
                  <CardMedia style={{
                    margin: 'auto'
                  }}>
                    <div style={{padding: '1rem'}}>
                      <ActivityIcon size={{width: 64, height: 64}}/>
                    </div>
                  </CardMedia>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Take Action!
                    </Typography>
                    <Typography
                      color={'textPrimary'}
                      gutterBottom>
                      Goals are just wishful thoughts and happy daydreams without execution.
                      Define the activities that will get you to the top of your mountains.
                    </Typography>
                  </CardContent>
                </Card>
                <Card style={{display: 'flex', textAlign: 'left', marginBottom: '1rem'}}>
                  <CardMedia style={{
                    margin: 'auto'
                  }}>
                    <div style={{padding: '1rem'}}>
                      <HistoryIcon style={{fontSize: '64px', color: '#00000055'}}/>
                    </div>
                  </CardMedia>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Retrospect on activities of the past.
                    </Typography>
                    <Typography
                      color={'textPrimary'}
                      gutterBottom>
                      Use the data of your past to drive what you do today.
                      Figure out where you can optimize your efforts.
                      <strong> Most importantly, learn when you should be taking it easy.</strong>
                    </Typography>
                  </CardContent>
                </Card>
              </Container>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
};

export const mapStateToProps = (globalState: GlobalState): Props => {
  return {}
}

export default connect(mapStateToProps)(About);
