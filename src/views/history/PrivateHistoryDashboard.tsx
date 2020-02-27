import React, {useState} from 'react';
import LoggedInLayout from '../components/LoggedInLayout';
import HistoryDashboardComponents from "./HistoryDashboardComponents";
import {Switch} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";

const PrivateHistoryDashboard = () => {
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
            shared && <IconButton
              color={'primary'}
              aria-label="Menu">
              <ShareIcon/>
            </IconButton>
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

export default PrivateHistoryDashboard;
