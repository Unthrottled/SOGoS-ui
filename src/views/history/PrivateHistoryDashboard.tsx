import React, {FC, useEffect} from 'react';
import LoggedInLayout from '../components/LoggedInLayout';
import HistoryDashboardComponents from "./HistoryDashboardComponents";
import {Switch} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";
import ViewIcon from "@material-ui/icons/Visibility";
import SocialShare from "../components/SocialShare";
import {connect, useDispatch} from "react-redux";
import {GlobalState, selectSecurityState, selectUserState} from "../../reducers";
import {createUserUpdatedSharedDashboardEvent} from "../../events/UserEvents";
import {createViewedHistoryEvent} from "../../events/HistoryEvents";
import {SharedStatus} from "../../reducers/SecurityReducer";
import { useHistory } from 'react-router-dom';

const PrivateHistoryDashboard: FC<Props> = ({
                                              userIdentifier,
                                              hasShared
                                            }) => {
  const shared = hasShared;
  const dispatch = useDispatch();
  const toggleShare = () => {
    dispatch(createUserUpdatedSharedDashboardEvent(!shared));
  }

  const history = useHistory();
  const navigateToSharedHistory = () => {
    history.push('./shared')
  }

  useEffect(() => {
    dispatch(createViewedHistoryEvent());
  }, [dispatch])

  return (
    <LoggedInLayout>
      <div style={{
        display: 'flex',
        marginBottom: '0.5rem',
      }}>
        <div style={{flexGrow: 1}}/>
        <div style={{display: "flex"}}>
          {
            shared &&
            (<div style={{display: 'flex'}}>
                <IconButton title={'View Shared Dashboard'}
                onClick={navigateToSharedHistory}>
                  <ViewIcon/>
                </IconButton>
                <SocialShare sharingUrl={
                  `https://sogos.unthrottled.io/user/${userIdentifier}/history`
                }><IconButton
                  title={'Share your dashboard!'}
                  color={'primary'}
                  aria-label="Menu">
                  <ShareIcon/>
                </IconButton>
                </SocialShare>
              </div>
            )
          }
          <InputLabel style={{margin: 'auto'}}><Switch
            checked={shared}
            onChange={toggleShare}
            color={'primary'}
          />Enable Sharing</InputLabel>
        </div>

      </div>
      <HistoryDashboardComponents/>
    </LoggedInLayout>
  );
};

interface Props {
  hasShared?: boolean;
  userIdentifier: string;
}

const mapStateToProps = (globalState: GlobalState): Props => {
  const {
    hasShared
  } = selectSecurityState(globalState);
  const {
    information: {
      guid
    }
  } = selectUserState(globalState)
  return {
    hasShared: hasShared === SharedStatus.SHARED,
    userIdentifier: guid
  }
}

export default connect(mapStateToProps)(PrivateHistoryDashboard);
