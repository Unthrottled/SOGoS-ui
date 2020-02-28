import React, {FC, useEffect} from 'react';
import LoggedInLayout from '../components/LoggedInLayout';
import HistoryDashboardComponents from "./HistoryDashboardComponents";
import {Switch} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";
import SocialShare from "../components/SocialShare";
import {connect, useDispatch} from "react-redux";
import {GlobalState, selectUserState} from "../../reducers";
import {createUserUpdatedSharedDashboardEvent} from "../../events/UserEvents";
import {createViewedHistoryEvent} from "../../events/HistoryEvents";

const PrivateHistoryDashboard: FC<Props> = ({
                                              userIdentifier,
                                              hasShared
                                            }) => {
  const shared = !!hasShared;
  const dispatch = useDispatch();
  const toggleShare = () => {
    dispatch(createUserUpdatedSharedDashboardEvent(!shared));
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
            (<SocialShare sharingUrl={
              `https://sogos.unthrottled.io/user/${userIdentifier}/history`
            }><IconButton
              color={'primary'}
              aria-label="Menu">
              <ShareIcon/>
            </IconButton>
            </SocialShare>)
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
    information: {guid}, miscellaneous: {
      security: {
        hasShared
      }
    }
  } = selectUserState(globalState);
  return {
    hasShared,
    userIdentifier: guid
  }
}

export default connect(mapStateToProps)(PrivateHistoryDashboard);
