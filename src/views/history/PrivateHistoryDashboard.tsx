import React, {FC, useState} from 'react';
import LoggedInLayout from '../components/LoggedInLayout';
import HistoryDashboardComponents from "./HistoryDashboardComponents";
import {Switch} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";
import SocialShare from "../components/SocialShare";
import {connect} from "react-redux";
import {GlobalState, selectUserState} from "../../reducers";

const PrivateHistoryDashboard: FC<Props> = ({
                                              userIdentifier
                                            }) => {
  const [shared, setShared] = useState(false);
  const toggleShare = () => {
    setShared(!shared);
  }

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
  userIdentifier: string;
}

const mapStateToProps = (globaState: GlobalState): Props => {
  const {information: {guid}} = selectUserState(globaState);
  return {
    userIdentifier: guid,
  }
}

export default connect(mapStateToProps)(PrivateHistoryDashboard);
