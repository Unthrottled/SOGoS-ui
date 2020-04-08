import React, {FC} from 'react';
import HistoryDashboardComponents from "./HistoryDashboardComponents";
import {connect, useDispatch} from "react-redux";
import {GlobalState, selectActivityState, selectSecurityState, selectUserState} from "../../reducers";
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
import Badge from "@material-ui/core/Badge";
import withStyles from "@material-ui/core/styles/withStyles";
import Banner from "../components/Banner";
import {push} from "connected-react-router";

interface Props {
  hasShared?: boolean;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  localAvatar?: string;
  email?: string;
  shouldTime?: boolean;
}

const StyledBadge = withStyles(theme => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Badge);

const useStyles = makeStyles(theme => ({
  container: {
    margin: '1.5rem',
    marginBottom: '5rem',
  },
  avatar: {
    width: 96,
    height: 96,
  }
}));

export const SOGoSSharedLogo = () => {
  const dispatch = useDispatch();
  const goHome = () => {
    dispatch(push('/login'))
  }
  return (<div style={{display: "flex"}} onClick={goHome}>
    <SOGoS size={{
      width: '100px',
      height: '100px',
    }} styles={{cursor:'pointer'}}/>
    <div style={{textAlign: 'left', marginLeft: '0.5rem'}}>
      <Typography style={{
        fontSize: '3rem',
        color: grey[700],
        cursor: 'pointer',
      }}>
        SOGoS
      </Typography>
      <Typography variant={"subtitle1"} style={{
        color: grey[500],
        cursor: 'pointer',
      }}>
        Strategic Orchestration and Governance System
      </Typography>
    </div>
  </div>);
}

const SharedHistoryDashboardComponents: FC<Props> = ({
                                                       hasShared,
                                                       fullName,
                                                       firstName,
                                                       lastName,
                                                       localAvatar,
                                                       email,
                                                       shouldTime,
                                                     }) => {
  const classes = useStyles();

  const userName = fullName ||
    `${firstName}${lastName ? ' ' + lastName : ''}`

  return hasShared === undefined || hasShared ? (
    <div className={classes.container}>
      <div style={{display: "flex", marginBottom: '1rem'}}>
        <SOGoSSharedLogo/>
        <span style={{flexGrow: 1}}/>
        {localAvatar &&
        <div style={{display: "flex"}}>
          <div style={{margin: 'auto 1rem', textAlign: 'right'}}>
            <Typography style={{
              color: grey[700],
              display: "flex",
              alignItems: 'center'
            }}>
              <span style={{flexGrow: 1}}/><span style={{marginRight: '0.5rem'}}>{userName}</span><PersonIcon/>
            </Typography>
            <Typography style={{
              color: grey[700],
              display: "flex",
              alignItems: 'center'
            }}>
              <span style={{flexGrow: 1}}/><span style={{marginRight: '0.5rem'}}>{email}</span><MailIcon/>
            </Typography>
          </div>
          <StyledBadge
            overlap="circle"
            invisible={!shouldTime}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <Avatar className={classes.avatar} src={localAvatar}/>
          </StyledBadge>
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
  ) : <Banner hideExcerpt>
    <Typography variant={'h5'} color="textSecondary">
      This user has elected to not share their Activity Dashboard at this time.
    </Typography>
  </Banner>;
};

const mapStateToProps = (state: GlobalState): Props => {
  const {
    readToken,
    isLoggedIn
  } = selectSecurityState(state);
  const {
    shouldTime
  } = selectActivityState(state);
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
    hasShared: !!readToken || isLoggedIn,
    fullName,
    firstName,
    lastName,
    email,
    localAvatar,
    shouldTime,
  }
}

export default connect(mapStateToProps)(SharedHistoryDashboardComponents);
