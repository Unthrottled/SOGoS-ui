import React, {FC} from 'react';
import HistoryDashboardComponents from "./HistoryDashboardComponents";
import {connect} from "react-redux";
import {GlobalState, selectSecurityState, selectUserState} from "../../reducers";
import SharedPausedPomodoro from "../time/SharedPausedPomodoro";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {SOGoS} from "../icons/SOGoS";
import {Avatar} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {grey} from "@material-ui/core/colors";
import Container from "@material-ui/core/Container";
import {HistoryIcon} from "../icons/HistoryIcon";
import PersonIcon from "@material-ui/icons/Person";
import MailIcon from "@material-ui/icons/Mail";

interface Props {
  hasShared?: boolean;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  localAvatar?: string;
  email?: string;
}

const useStyles = makeStyles(theme => ({
  container: {
    margin: '1.5rem',
    marginBottom: '5rem',
  },
  avatar: {
    width: 96,
    height: 96,
  }
}))

const SharedHistoryDashboardComponents: FC<Props> = ({
                                                       hasShared,
                                                       fullName,
                                                       firstName,
                                                       lastName,
                                                       localAvatar,
                                                       email,
                                                     }) => {
  const classes = useStyles();

  const userName = fullName ||
    `${firstName}${lastName ? ' ' + lastName : ''}`

  return hasShared === undefined || hasShared ? (
    <div className={classes.container}>
      <div style={{display: "flex", marginBottom: '1rem'}}>
        <div style={{display: "flex"}}>
          <SOGoS size={{
            width: '100px',
            height: '100px',
          }}/>
          <div style={{textAlign: 'left', marginLeft: '0.5rem'}}>
            <Typography style={{
              fontSize: '3rem',
              color: grey[700]
            }}>
              SOGoS
            </Typography>
            <Typography variant={"subtitle1"} style={{
              color: grey[500]
            }}>
              Strategic Orchestration and Governance System
            </Typography>
          </div>
        </div>
        <span style={{flexGrow: 1}}/>
        {localAvatar &&
        <div style={{display: "flex"}}>
          <div style={{margin: 'auto 1rem', textAlign: 'right'}}>
            <Typography style={{
              color: grey[700],
              display: "flex",
              alignItems: 'center'
            }}>
              <span style={{flexGrow: 1}} /><span style={{marginRight: '0.5rem'}}>{userName}</span><PersonIcon />
            </Typography>
            <Typography style={{
              color: grey[700],
              display: "flex",
              alignItems: 'center'
            }}>
              <span style={{flexGrow: 1}} /><span style={{marginRight: '0.5rem'}} >{email}</span><MailIcon/>
            </Typography>
          </div>
          <Avatar className={classes.avatar} src={localAvatar}/>
        </div>
        }
      </div>
      <HistoryDashboardComponents>
        <div style={{textAlign: "left", padding: '0.5rem 1rem'}}>
          <Typography variant={"h5"} style={{display: 'flex'}} gutterBottom>
            Activity Dashboard
            <span style={{marginLeft: '0.5rem'}}>
              <HistoryIcon size={{
                width: '25px',
                height: '25px'
              }}/>
            </span>
          </Typography>
          <Container maxWidth={"sm"} style={{marginLeft: 0}}>
            <Typography style={{
              color: grey[700]
            }}>
              {userName} wanted to show you what what they care about the most.
            </Typography>
            <Typography style={{
              color: grey[700]
            }}>
              Below is how they have spent their time towards accomplishing their goals.
            </Typography>
          </Container>
        </div>
      </HistoryDashboardComponents>
      <SharedPausedPomodoro/>
    </div>
  ) : <div>
    They no share
  </div>;
};

const mapStateToProps = (state: GlobalState): Props => {
  const {
    readToken
  } = selectSecurityState(state);
  const {
    information: {
      fullName,
      firstName,
      lastName,
      email,
      localAvatar,
    }
  } = selectUserState(state)
  return {
    hasShared: !!readToken,
    fullName,
    firstName,
    lastName,
    email,
    localAvatar,
  }
}

export default connect(mapStateToProps)(SharedHistoryDashboardComponents);
