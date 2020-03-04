import React, {FC, useEffect} from 'react';
import HistoryDashboardComponents from "./HistoryDashboardComponents";
import {connect, useDispatch} from "react-redux";
import {createViewedSharedHistoryEvent} from "../../events/HistoryEvents";
import {GlobalState, selectSecurityState, selectUserState} from "../../reducers";
import SharedPausedPomodoro from "../time/SharedPausedPomodoro";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {SOGoS} from "../icons/SOGoS";
import {Avatar} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {grey} from "@material-ui/core/colors";
import Container from "@material-ui/core/Container";
import {HistoryIcon} from "../icons/HistoryIcon";

interface Props {
  hasShared?: boolean;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  localAvatar?: string;
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

const SharedHistoryDashboard: FC<Props> = ({
                                             hasShared,
                                             fullName,
                                             firstName,
                                             lastName,
                                             localAvatar,
                                           }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(createViewedSharedHistoryEvent());
  }, [dispatch]);

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
        {localAvatar && <Avatar className={classes.avatar} src={localAvatar}/>}
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
      localAvatar,
    }
  } = selectUserState(state)
  return {
    hasShared: !!readToken,
    fullName,
    firstName,
    lastName,
    localAvatar,
  }
}

export default connect(mapStateToProps)(SharedHistoryDashboard);
